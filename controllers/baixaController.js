const BaixaModel = require('../models/baixaModel');
const ItemBaixaModel = require('../models/itemBaixaModel');
const ProdutoModel = require('../models/produtoModel');
const PFisicaModel = require('../models/pfisicaModel');

class BaixaController {

    // Visualizar página de cadastro de baixa
    async cadastrarView(req, res) {
        res.render('admin/cadastrarBaixa', { layout: 'layout_admin' });
    }

    // Buscar produtos para autocomplete
    async buscarProdutos(req, res) {
        try {
            const termo = req.query.termo || '';
            const produto = new ProdutoModel();
            
            // Buscar apenas produtos e insumos (tipos 1 e 2)
            const sql = `
                SELECT 
                    prod_id as id,
                    prod_nome as nome,
                    prod_tipo as tipo,
                    prod_preco as preco,
                    prod_estoque as estoque
                FROM tb_Produto
                WHERE (prod_tipo = 1 OR prod_tipo = 2)
                AND prod_nome LIKE ?
                AND prod_estoque > 0
                ORDER BY prod_nome
                LIMIT 20
            `;
            
            const Database = require('../utils/database');
            const banco = new Database();
            const produtos = await banco.ExecutaComando(sql, [`%${termo}%`]);
            
            res.json(produtos);
        } catch (error) {
            console.error('Erro ao buscar produtos:', error);
            res.status(500).json({ erro: 'Erro ao buscar produtos' });
        }
    }

    // Gravar baixa de estoque
    async gravar(req, res) {
        try {
            const { itens } = req.body;

            // Buscar funcionário logado pelos cookies
            let func = new PFisicaModel(null, null, null, req.cookies.UsuarioEmail, req.cookies.UsuarioSenha, null, null);
            func = await func.logarEmailSenha();

            if (!func || !func.id) {
                return res.status(401).json({ 
                    ok: false, 
                    msg: 'Funcionário não identificado! Faça login novamente.' 
                });
            }

            // Validações
            if (!itens || itens.length === 0) {
                return res.status(400).json({ 
                    ok: false, 
                    msg: 'É necessário adicionar ao menos um item para realizar a baixa!' 
                });
            }

            const idFuncionario = func.id;

            // Verificar estoque de todos os itens antes de processar
            const produto = new ProdutoModel();
            for (let item of itens) {
                produto.id = item.idProduto;
                const verificacao = await produto.verificarEstoque(item.quantidade);
                
                if (!verificacao.disponivel) {
                    return res.status(400).json({
                        ok: false,
                        msg: `Produto "${verificacao.nomeProduto}" não possui estoque suficiente! Estoque disponível: ${verificacao.estoqueAtual}`
                    });
                }
            }

            // Criar registro de baixa
            const baixa = new BaixaModel(null, idFuncionario, new Date());
            const baixaId = await baixa.gravar();

            if (baixaId > 0) {
                // Gravar itens da baixa e atualizar estoque
                for (let item of itens) {
                    const itemBaixa = new ItemBaixaModel(
                        null,
                        baixaId,
                        item.idProduto,
                        item.quantidade,
                        item.valorUnitario,
                        item.motivo
                    );
                    
                    await itemBaixa.gravar();
                    
                    // Diminuir estoque (quantidade negativa)
                    produto.id = item.idProduto;
                    await produto.atualizarEstoque(-item.quantidade);
                }

                res.json({ 
                    ok: true, 
                    msg: 'Baixa de estoque registrada com sucesso!',
                    baixaId: baixaId
                });
            } else {
                res.status(500).json({ 
                    ok: false, 
                    msg: 'Erro ao processar baixa de estoque!' 
                });
            }
        } catch (error) {
            console.error('Erro ao gravar baixa:', error);
            res.status(500).json({ 
                ok: false, 
                msg: 'Erro ao processar baixa de estoque!' 
            });
        }
    }

    // Listar todas as baixas
    async listarView(req, res) {
        res.render('admin/listagemBaixas', { layout: 'layout_admin' });
    }

    // API para listagem de baixas
    async listar(req, res) {
        try {
            const termo = req.query.termo || null;
            const dataInicio = req.query.dataInicio || null;
            const dataFim = req.query.dataFim || null;

            const baixa = new BaixaModel();
            const lista = await baixa.listar(termo, dataInicio, dataFim);

            res.json({ lista });
        } catch (error) {
            console.error('Erro ao listar baixas:', error);
            res.status(500).json({ erro: 'Erro ao listar baixas' });
        }
    }

    // Visualizar detalhes de uma baixa específica
    async detalhesView(req, res) {
        try {
            const baixaId = req.params.id;

            const baixa = new BaixaModel();
            const dadosBaixa = await baixa.buscarPorId(baixaId);

            if (!dadosBaixa) {
                return res.status(404).send('Baixa não encontrada');
            }

            const itemBaixa = new ItemBaixaModel();
            const itens = await itemBaixa.listarPorBaixa(baixaId);

            res.render('admin/baixaDetalhes', {
                layout: 'layout_admin',
                baixa: dadosBaixa,
                itens: itens
            });
        } catch (error) {
            console.error('Erro ao buscar detalhes da baixa:', error);
            res.status(500).send('Erro ao carregar detalhes da baixa');
        }
    }
}

module.exports = BaixaController;
