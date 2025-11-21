const ItemVendaModel = require("../models/pedidoItemModel");
const VendaModel = require("../models/pedidoModel");
const ProdutoModel = require("../models/produtoModel");

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

    async gravar(req, res) {
        console.log(req.body);
        let ok = false;
        let msg = "";

        //processo de gravação da venda
        if(req.body.length > 0) {
            let itensPedido = req.body;
            
            // Calcular valor total da venda
            let valorTotal = 0;
            for(let i = 0; i < itensPedido.length; i++) {
                valorTotal += parseFloat(itensPedido[i].price) * parseInt(itensPedido[i].quantity);
            }
            
            let vendaModel = new VendaModel();
            vendaModel.vendaValorTotal = valorTotal;
            vendaModel.vendaIdPessoa = null; // Por enquanto null, pode ser vinculado ao usuário logado
            let vendaId = await vendaModel.gravar();
            
            if(vendaId > 0) {
                let produtoModel = new ProdutoModel();
                for(let i = 0; i < itensPedido.length; i++) {
                    let produtoId = itensPedido[i].id;
                    let produtoEncontrado = await produtoModel.buscarId(produtoId);
                    if(produtoEncontrado != null) {
                        let itemVendaModel = new ItemVendaModel();
                        itemVendaModel.produtoId = produtoId;
                        itemVendaModel.vendaId = vendaId;
                        itemVendaModel.itemVendaValor = produtoEncontrado.preco;
                        itemVendaModel.itemVendaQuantidade = itensPedido[i].quantity;

                        await itemVendaModel.gravar();
                    }
                }

                ok = true;
                msg = "Pedido gravado com sucesso!";
            }
            else {
                ok = false;
                msg = "Erro ao gerar pedido!";
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
