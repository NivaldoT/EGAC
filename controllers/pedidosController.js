const ItemVendaModel = require("../models/pedidoItemModel");
const VendaModel = require("../models/pedidoModel");
const ProdutoModel = require("../models/produtoModel");
const PessoaModel = require("../models/pessoaModel");

class PedidosController {

    async pedidosView(req, res) {
        res.render("admin/vendas", {layout: 'layout_admin'})
    }

    async listarPedidos(req, res) {
        let termo = null;
        if(req.query.termo) {
            termo = req.query.termo;
        }
        let itemVenda = new ItemVendaModel();
        let lista = await itemVenda.listar(termo);
        res.send({lista});
    }

    async detalhesView(req, res) {
        const vendaId = req.params.id;
        
        // Buscar dados da venda
        let vendaModel = new VendaModel();
        let venda = await vendaModel.buscarPorId(vendaId);
        
        // Buscar itens da venda
        let itemVenda = new ItemVendaModel();
        let itens = await itemVenda.listar(vendaId);
        
        // Converter itens para JSON
        let itensJSON = itens.map(item => item.toJSON());
        
        console.log('Itens JSON:', JSON.stringify(itensJSON, null, 2));
        
        res.render("admin/vendaDetalhes", {
            layout: 'layout_admin',
            venda: venda,
            itens: itensJSON
        });
    }

    async gravar(req, res) {
        let ok = false;
        let msg = "";

        //processo de gravação da venda
        if(req.body.length > 0) {
            let itensPedido = req.body;
            
            // Buscar ID do cliente logado pelos cookies
            let idPessoa = null;
            let nomeCliente = null;
            
            if(req.cookies && req.cookies.UsuarioEmail && req.cookies.UsuarioSenha) {
                let pessoa = new PessoaModel(null, null, null, null, req.cookies.UsuarioEmail, req.cookies.UsuarioSenha);
                pessoa = await pessoa.logarEmailSenha();
                
                if(pessoa) {
                    idPessoa = pessoa.id;
                    nomeCliente = pessoa.nome;
                }
            }
            
            // VALIDAÇÃO: Rejeitar vendas anônimas
            if(!idPessoa) {
                ok = false;
                msg = "É necessário estar logado para realizar uma compra!";
                res.send({ok, msg});
                return;
            }
            
            // VERIFICAR ESTOQUE ANTES DE PROCESSAR A VENDA
            let produtoModel = new ProdutoModel();
            for(let i = 0; i < itensPedido.length; i++) {
                let produtoId = itensPedido[i].id;
                let quantidade = parseInt(itensPedido[i].quantity);
                
                produtoModel.id = produtoId;
                let verificacao = await produtoModel.verificarEstoque(quantidade);
                
                if(!verificacao.disponivel) {
                    ok = false;
                    msg = `Produto "${verificacao.nomeProduto}" não possui estoque suficiente! Estoque disponível: ${verificacao.estoqueAtual}`;
                    res.send({ok, msg});
                    return;
                }
            }
            
            // Calcular valor total da venda
            let valorTotal = 0;
            for(let i = 0; i < itensPedido.length; i++) {
                valorTotal += parseFloat(itensPedido[i].price) * parseInt(itensPedido[i].quantity);
            }
            
            let vendaModel = new VendaModel();
            vendaModel.vendaValorTotal = valorTotal;
            vendaModel.vendaIdPessoa = idPessoa; // Vincula ao cliente logado
            let vendaId = await vendaModel.gravar();
            
            if(vendaId > 0) {
                for(let i = 0; i < itensPedido.length; i++) {
                    let produtoId = itensPedido[i].id;
                    let quantidade = parseInt(itensPedido[i].quantity);
                    let produtoEncontrado = await produtoModel.buscarId(produtoId);
                    
                    if(produtoEncontrado != null) {
                        let itemVendaModel = new ItemVendaModel();
                        itemVendaModel.produtoId = produtoId;
                        itemVendaModel.vendaId = vendaId;
                        itemVendaModel.itemVendaValor = produtoEncontrado.preco;
                        itemVendaModel.itemVendaQuantidade = quantidade;

                        await itemVendaModel.gravar();
                        
                        // DIMINUIR ESTOQUE (quantidade negativa)
                        produtoModel.id = produtoId;
                        await produtoModel.atualizarEstoque(-quantidade);
                    }
                }

                ok = true;
                msg = `Compra realizada com sucesso, ${nomeCliente}!`;
            }
            else {
                ok = false;
                msg = "Erro ao processar compra!";
            }
        }
        else {
            ok = false;
            msg = "Não há produtos no carrinho!";
        }

        res.send({ok: ok, msg: msg});
    }
}

module.exports = PedidosController;
