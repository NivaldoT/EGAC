const DevolucaoVendaModel = require('../models/devolucaoVendaModel');
const ItemDevolVendaModel = require('../models/itemDevolVendaModel');
const PessoaModel = require('../models/pessoaModel');
const ContaPagarModel = require('../models/contaPagarModel');
const ProdutoModel = require('../models/produtoModel');
const multer = require('multer');
const path = require('path');

// Configurar upload de imagens
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, global.CAMINHO_IMG_PRODUTOS_ABS || './public/images/produtos/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'devolucao-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    fileFilter: function (req, file, cb) {
        const filetypes = /jpeg|jpg|png|gif/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        
        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error('Apenas imagens são permitidas (jpeg, jpg, png, gif)'));
    }
}).single('foto');

class DevolucaoController {
    
    // Solicitar devolução (Cliente)
    async solicitarDevolucao(req, res) {
        upload(req, res, async function (err) {
            try {
                if (err) {
                    console.error('Erro no upload:', err);
                    return res.status(400).json({ ok: false, msg: err.message });
                }

                const userEmail = req.cookies.UsuarioEmail;
                if (!userEmail) {
                    return res.status(401).json({ ok: false, msg: 'Usuário não autenticado' });
                }

                const { idVenda, motivo, tipoReembolso, itens } = req.body;
                
                console.log('Dados recebidos:', { idVenda, motivo, tipoReembolso, itens: itens ? 'presente' : 'ausente', file: req.file ? 'presente' : 'ausente' });
                
                if (!idVenda || !motivo || !tipoReembolso) {
                    return res.status(400).json({ ok: false, msg: 'Todos os campos são obrigatórios' });
                }

                if (!req.file) {
                    return res.status(400).json({ ok: false, msg: 'A foto é obrigatória' });
                }

                if (!itens) {
                    return res.status(400).json({ ok: false, msg: 'Selecione pelo menos um item para devolução' });
                }

                // Parse dos itens
                let itensArray;
                try {
                    itensArray = JSON.parse(itens);
                } catch (e) {
                    console.error('Erro ao fazer parse dos itens:', e);
                    return res.status(400).json({ ok: false, msg: 'Dados de itens inválidos' });
                }

                if (!Array.isArray(itensArray) || itensArray.length === 0) {
                    return res.status(400).json({ ok: false, msg: 'Selecione pelo menos um item para devolução' });
                }

                // Buscar ID do cliente pelo email
                let pessoaModel = new PessoaModel();
                let cliente = await pessoaModel.buscarPorEmail(userEmail);
                
                if (!cliente) {
                    return res.status(404).json({ ok: false, msg: 'Cliente não encontrado' });
                }

                // Verificar se já existe devolução para esta venda
                let devolucaoModel = new DevolucaoVendaModel();
                let devolucaoExistente = await devolucaoModel.verificarDevolucaoExistente(idVenda);
                
                if (devolucaoExistente) {
                    let statusMsg = devolucaoExistente.devo_status === 'pendente' 
                        ? 'Já existe uma solicitação pendente para este pedido'
                        : 'Este pedido já possui uma devolução';
                    return res.status(400).json({ ok: false, msg: statusMsg });
                }

                // Criar nova devolução
                devolucaoModel.idVenda = idVenda;
                devolucaoModel.motivo = motivo;
                devolucaoModel.tipoReembolso = tipoReembolso;
                devolucaoModel.foto = req.file ? 'images/produtos/' + req.file.filename : null;

                let idDevolucao = await devolucaoModel.gravar();

                if (!idDevolucao) {
                    return res.status(500).json({ ok: false, msg: 'Erro ao criar devolução' });
                }

                // Adicionar itens da devolução
                let itemDevolModel = new ItemDevolVendaModel();
                
                for(let item of itensArray) {
                    itemDevolModel.idDevolucao = idDevolucao;
                    itemDevolModel.idProduto = item.produtoId;
                    itemDevolModel.quantidade = item.quantidade;
                    itemDevolModel.preco = item.preco;
                    itemDevolModel.motivo = motivo;
                    itemDevolModel.foto = req.file ? 'images/produtos/' + req.file.filename : null;
                    await itemDevolModel.gravar();
                }

                return res.json({ ok: true, msg: 'Solicitação de devolução enviada com sucesso!' });

            } catch (error) {
                console.error('Erro ao solicitar devolução:', error);
                return res.status(500).json({ ok: false, msg: 'Erro interno do servidor: ' + error.message });
            }
        });
    }

    // Listar devoluções do cliente
    async minhasDevolucoes(req, res) {
        try {
            const userEmail = req.cookies.UsuarioEmail;
            
            if (!userEmail) {
                return res.redirect('/usuario/login');
            }

            let devolucaoModel = new DevolucaoVendaModel();
            let devolucoes = await devolucaoModel.listarPorCliente(userEmail);

            // Buscar itens de cada devolução
            let itemDevolModel = new ItemDevolVendaModel();
            for(let dev of devolucoes) {
                dev.itens = await itemDevolModel.listarPorDevolucao(dev.id);
            }

            res.render('shop/minhas-devolucoes', { devolucoes: devolucoes });
        } catch (error) {
            console.error('Erro ao buscar devoluções:', error);
            res.status(500).send('Erro ao carregar devoluções');
        }
    }

    // Listar todas as devoluções (Admin)
    async listarDevolucoes(req, res) {
        try {
            let devolucaoModel = new DevolucaoVendaModel();
            let devolucoes = await devolucaoModel.listar();

            // Buscar itens de cada devolução e adicionar motivo
            let itemDevolModel = new ItemDevolVendaModel();
            for(let dev of devolucoes) {
                dev.itens = await itemDevolModel.listarPorDevolucao(dev.id);
                // Pegar motivo do primeiro item
                if (dev.itens && dev.itens.length > 0) {
                    dev.motivo = dev.itens[0].motivo;
                    dev.foto = dev.itens[0].foto;
                }
            }

            res.render('admin/devolucoes/listar', { 
                layout: 'layout_admin',
                devolucoes: devolucoes 
            });
        } catch (error) {
            console.error('Erro ao listar devoluções:', error);
            res.status(500).send('Erro ao carregar devoluções');
        }
    }

    // Visualizar detalhes da devolução (Admin)
    async visualizarDevolucao(req, res) {
        try {
            const { id } = req.params;
            
            let devolucaoModel = new DevolucaoVendaModel();
            let devolucao = await devolucaoModel.buscarPorId(id);

            if (!devolucao) {
                return res.status(404).send('Devolução não encontrada');
            }

            // Buscar itens da devolução
            let itemDevolModel = new ItemDevolVendaModel();
            let itens = await itemDevolModel.listarPorDevolucao(id);

            // Pegar motivo e foto do primeiro item
            if (itens && itens.length > 0) {
                devolucao.motivo = itens[0].motivo;
                devolucao.foto = itens[0].foto;
            }

            // Calcular valor total da devolução
            devolucao.valorTotal = itens.reduce((acc, item) => acc + (item.preco * item.quantidade), 0);

            res.render('admin/devolucoes/visualizar', { 
                layout: 'layout_admin',
                devolucao: devolucao, 
                itens: itens 
            });
        } catch (error) {
            console.error('Erro ao visualizar devolução:', error);
            res.status(500).send('Erro ao carregar devolução');
        }
    }

    // Aprovar devolução e gerar conta a pagar (Admin)
    async aprovarDevolucao(req, res) {
        try {
            const { id } = req.params;
            // Verificação já feita pelo middleware authMiddleware
            // Não precisa verificar cookies aqui

            // Buscar dados da devolução
            let devolucaoModel = new DevolucaoVendaModel();
            let devolucao = await devolucaoModel.buscarPorId(id);

            if (!devolucao) {
                return res.status(404).json({ ok: false, msg: 'Devolução não encontrada' });
            }

            // Buscar itens para calcular valor total
            let itemDevolModel = new ItemDevolVendaModel();
            let itens = await itemDevolModel.listarPorDevolucao(id);
            let valorTotal = itens.reduce((acc, item) => acc + (item.preco * item.quantidade), 0);

            // Aprovar devolução
            devolucaoModel.id = id;
            let resultAprovacao = await devolucaoModel.aprovar();

            if (!resultAprovacao) {
                return res.status(500).json({ ok: false, msg: 'Erro ao aprovar devolução' });
            }

            // Atualizar estoque dos produtos devolvidos
            console.log('=== ATUALIZANDO ESTOQUE ===');
            console.log('Total de itens:', itens.length);
            for (let item of itens) {
                console.log(`Produto ID: ${item.idProduto}, Quantidade a adicionar: ${item.quantidade}`);
                let produtoModel = new ProdutoModel(item.idProduto, null, null, null, null, null, null, null, null, null, null);
                let resultEstoque = await produtoModel.atualizarEstoque(item.quantidade);
                console.log(`Resultado atualização estoque:`, resultEstoque);
            }
            console.log('=== FIM ATUALIZAÇÃO ESTOQUE ===');

            // Gerar conta a pagar
            console.log('=== GERANDO CONTA A PAGAR ===');
            console.log('Valor total:', valorTotal);
            console.log('ID Devolução:', id);
            
            let contaPagarModel = new ContaPagarModel();
            contaPagarModel.operacao = 2; // 2 = Devolução de Venda
            contaPagarModel.idDevoVenda = id;
            contaPagarModel.valor = valorTotal;
            const hoje = new Date();
            const vencimentoStr = hoje.toISOString().slice(0, 10);
            contaPagarModel.dataVencimento = vencimentoStr;
            contaPagarModel.isPago = 0; // 0 = não pago
            contaPagarModel.numParcela = 1;
            contaPagarModel.totParcelas = 1;

            let resultConta = await contaPagarModel.gravar();
            console.log('Resultado gravar conta:', resultConta);
            console.log('=== FIM GERAR CONTA A PAGAR ===');

            if (resultConta) {
                return res.json({ 
                    ok: true, 
                    msg: 'Devolução aprovada e conta a pagar gerada com sucesso!' 
                });
            } else {
                return res.json({ 
                    ok: true, 
                    msg: 'Devolução aprovada, mas houve erro ao gerar conta a pagar' 
                });
            }

        } catch (error) {
            console.error('Erro ao aprovar devolução:', error);
            return res.status(500).json({ ok: false, msg: 'Erro interno do servidor' });
        }
    }

    // Recusar devolução (Admin)
    async recusarDevolucao(req, res) {
        try {
            const { id } = req.params;
            // Verificação já feita pelo middleware authMiddleware
            // Não precisa verificar cookies aqui

            let devolucaoModel = new DevolucaoVendaModel();
            devolucaoModel.id = id;
            let result = await devolucaoModel.recusar();

            if (result) {
                return res.json({ ok: true, msg: 'Devolução recusada' });
            } else {
                return res.status(500).json({ ok: false, msg: 'Erro ao recusar devolução' });
            }

        } catch (error) {
            console.error('Erro ao recusar devolução:', error);
            return res.status(500).json({ ok: false, msg: 'Erro interno do servidor' });
        }
    }
}

module.exports = DevolucaoController;
