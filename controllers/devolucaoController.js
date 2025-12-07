const DevolucaoVendaModel = require('../models/devolucaoVendaModel');
const ItemDevolVendaModel = require('../models/itemDevolVendaModel');
const PessoaModel = require('../models/pessoaModel');
const ContaPagarModel = require('../models/contaPagarModel');
const ProdutoModel = require('../models/produtoModel');
const multer = require('multer');
const path = require('path');
const CompraModel = require('../models/compraModel');
const DevolucaoCompraModel = require('../models/devolucaoCompraModel');
const ItemDevoCompraModel = require('../models/itemDevoCompraModel');
const produtoModel = require('../models/produtoModel');
const ContaReceberModel = require('../models/contaReceberModel');

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

                const { idVenda, motivo, itens, comentario, tipoReembolso } = req.body;
                
                console.log('Dados recebidos:', { idVenda, motivo, itens: itens ? 'presente' : 'ausente', file: req.file ? 'presente' : 'ausente' });
                
                if (!idVenda || !motivo || !comentario || !tipoReembolso) {
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
                    itemDevolModel.comentario = comentario;
                    itemDevolModel.foto = req.file ? 'images/produtos/' + req.file.filename : null;
                    itemDevolModel.tipoReembolso = tipoReembolso;
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

            res.render('usuario/minhas-devolucoes', { devolucoes: devolucoes });
        } catch (error) {
            console.error('Erro ao buscar devoluções:', error);
            res.status(500).send('Erro ao carregar devoluções');
        }
    }

    // Visualizar devolução individual (Cliente)
    async visualizarDevolucao(req, res) {
        try {
            const { id } = req.params;
            const userEmail = req.cookies.UsuarioEmail;
            
            if (!userEmail) {
                return res.redirect('/usuario/login');
            }

            let devolucaoModel = new DevolucaoVendaModel();
            let devolucao = await devolucaoModel.buscarPorId(id);

            if (!devolucao) {
                return res.status(404).send('Devolução não encontrada');
            }

            // Buscar itens da devolução
            let itemDevolModel = new ItemDevolVendaModel();
            let itens = await itemDevolModel.listarPorDevolucao(id);

            res.render('usuario/visualizar-devolucao', { 
                devolucao: devolucao,
                itens: itens
            });
        } catch (error) {
            console.error('Erro ao visualizar devolução:', error);
            res.status(500).send('Erro ao carregar devolução');
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
                devolucao.tipoReembolso = itens[0].tipoReembolso;
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
            let ok;
            let msg = '';
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
            // let resultAprovacao = await devolucaoModel.aprovar();

            // if (!resultAprovacao) {
            //     return res.status(500).json({ ok: false, msg: 'Erro ao aprovar devolução' });
            // }

            if(itens[0].tipoReembolso === 'Reenvio') {
                // Atualizar estoque dos produtos devolvidos
                console.log('=== ATUALIZANDO ESTOQUE ===');
                console.log('Total de itens:', itens.length);
                for (let item of itens) {
                    console.log(`Produto ID: ${item.idProduto}, Quantidade a adicionar: ${item.quantidade}`);
                    let produtoModel = new ProdutoModel(item.idProduto);
                    let resultEstoque = await produtoModel.atualizarEstoque(-item.quantidade);
                    console.log(`Resultado atualização estoque:`, resultEstoque);
                    if(resultEstoque) {
                        ok = true;
                        msg = 'Devolução aprovada, produtos enviados e estoque atualizado com sucesso!';
                    } else {msg = 'Erro ao atualizar estoque do produto ID ' + item.idProduto;};
                }
                console.log('=== FIM ATUALIZAÇÃO ESTOQUE ===');
            }

            if(itens[0].tipoReembolso === 'Reembolso') {
                // Gerar conta a pagar
                console.log('=== GERANDO CONTA A PAGAR ===');
                console.log('Valor total:', valorTotal);
                console.log('ID Devolução:', id);
                console.log('ID Cliente:', devolucao.idCliente);
                
                let contaPagarModel = new ContaPagarModel();
                contaPagarModel.operacao = 2; // 2 = Devolução de Venda
                contaPagarModel.idDevoVenda = id;
                contaPagarModel.idPessoa = devolucao.idCliente; // ID do cliente que receberá o reembolso
                contaPagarModel.valor = valorTotal;
                const hoje = new Date();
                const vencimentoStr = hoje.toISOString().slice(0, 10);
                contaPagarModel.dataVencimento = vencimentoStr;
                contaPagarModel.isPago = 0; // 0 = não pago
                contaPagarModel.numParcela = 1;
                contaPagarModel.totParcelas = 1;

                let resultConta = await contaPagarModel.gravar();
                if(resultConta) {
                    ok = true;
                    msg = 'Devolução aprovada e conta a pagar gerada com sucesso!';
                } else {msg = 'Erro ao gerar conta a pagar para a devolução ID ' + id;}

                console.log('Resultado gravar conta:', resultConta);
                console.log('=== FIM GERAR CONTA A PAGAR ===');
            }

            return res.json({ ok: ok, msg: msg });

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

                    //DEVOLUÇÃO DE COMPRA
    async devolverCompra(req,res){
        let ok;
        let msg;

        let itensDevolucao = req.body.itensDevolucao;
        let idCompra = req.body.idCompra;

        let compra = new CompraModel(idCompra);
        compra = await compra.buscarPorId();
        if(compra){
            let DevoCompra = new DevolucaoCompraModel(null,compra.id);
            let idDevolucao = await DevoCompra.gravar();        //grava a devolução
            if(idDevolucao){
                for(let i=0; i<itensDevolucao.length; i++){
                    let itemDevoCompraModel = new ItemDevoCompraModel(null,idDevolucao,itensDevolucao[i].id,itensDevolucao[i].qtd,itensDevolucao[i].preco,itensDevolucao[i].motivo);   //criar item de devolução
                    ok = await itemDevoCompraModel.gravar();
                    if(ok){          //grava o item da devolução, atualiza estoque(diminuindo)
                        let prod = new produtoModel(itensDevolucao[i].id);
                        ok = await prod.atualizarEstoque(-itensDevolucao[i].qtd);
                        if(!ok){msg = 'Erro ao atualizar estoque!'; i = itensDevolucao.length;}
                    }
                    else{msg = 'Erro ao gravar item de devolução!'; i = itensDevolucao.length;};

                    if(ok){         //cria e grava a conta a receber
                        let dataVencimento = new Date(new Date().setMonth(new Date().getMonth()+1));//data de vencimento 1 mês após hoje
                        let contaReceber = new ContaReceberModel(null,3,null,null,idDevolucao,itensDevolucao[i].preco*itensDevolucao[i].qtd,new Date(dataVencimento),0,1,1);
                        ok = await contaReceber.gravar();
                        if(!ok){msg = 'Erro ao gravar conta a receber!'; i = itensDevolucao.length;}
                    }
                }
                if(ok){
                    msg = 'Devolução registrada com sucesso!';
                }
            }
        }
        res.send({ok,msg});
    }
}

module.exports = DevolucaoController;
