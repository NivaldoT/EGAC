const PedidoItemModel = require("../models/pedidoItemModel");
const PedidoModel = require("../models/pedidoModel");
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
        let pedidoItem = new PedidoItemModel();
        let lista = await pedidoItem.listar(termo);
        res.send({lista});
    }

    async gravar(req, res) {
        console.log(req.body);
        let ok = false;
        let msg = "";

        //processo de gravação do pedido
        if(req.body.length > 0) {
            let itensPedido = req.body;
            
            // Calcular valor total do pedido
            let valorTotal = 0;
            for(let i = 0; i < itensPedido.length; i++) {
                valorTotal += parseFloat(itensPedido[i].price) * parseInt(itensPedido[i].quantity);
            }
            
            let pedidoModel = new PedidoModel();
            pedidoModel.pedidoValorTotal = valorTotal;
            let pedidoId = await pedidoModel.gravar();
            
            if(pedidoId > 0) {
                let produtoModel = new ProdutoModel();
                for(let i = 0; i < itensPedido.length; i++) {
                    let produtoId = itensPedido[i].id;
                    let produtoEncontrado = await produtoModel.buscarId(produtoId);
                    if(produtoEncontrado != null) {
                        let itemPedidoModel = new PedidoItemModel();
                        itemPedidoModel.produtoId = produtoId;
                        itemPedidoModel.pedidoId = pedidoId;
                        itemPedidoModel.pedidoItemValor = produtoEncontrado.preco;
                        itemPedidoModel.pedidoItemQuantidade = itensPedido[i].quantity;
                        itemPedidoModel.pedidoItemValorTotal = produtoEncontrado.preco * itensPedido[i].quantity;

                        await itemPedidoModel.gravar();
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
