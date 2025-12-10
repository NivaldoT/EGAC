const cookieParser = require("cookie-parser");
const PFisicaModel = require("../models/pfisicaModel");
const CompraModel = require("../models/compraModel");
const ItensCompraModel = require("../models/itensCompraModel");
const produtoModel = require("../models/produtoModel");
const ContaPagarModel = require("../models/contaPagarModel");
const ItemDevoCompraModel = require("../models/itemDevoCompraModel");
const DevolucaoCompraModel = require("../models/devolucaoCompraModel");
const ContaReceberModel = require("../models/contaReceberModel");
const PJModel = require("../models/pjuridicaModel");

class CompraController{

    async homeView(req,res){
        let listaFornecedor = new PJModel();
        listaFornecedor = await listaFornecedor.listar()
        res.render('admin/compras/home.ejs', {layout:'layout_admin', listaFornecedor});
    }
    async comprarView(req,res){
        let func = new PFisicaModel(null,null,null,req.cookies.UsuarioEmail,req.cookies.UsuarioSenha,null,null);
        func = await func.logarEmailSenha();
        res.render('admin/compras/comprar.ejs',{layout: 'layout_admin', func});
    }

    async listar(req, res) {
        let termo = req.query.termo;

        let filtro = req.query.filtro;
        let fornecedor = req.query.fornecedor;
        let dataInicial = req.query.dataInicial;
        let dataFinal = req.query.dataFinal;
        if(dataFinal)
            dataFinal = dataFinal + ' 23:59:59';  

        let itemCompra = new ItensCompraModel();
        let listaItens = await itemCompra.listar(termo,filtro,fornecedor,dataInicial,dataFinal);

        let compra = new CompraModel();
        let listaCompra = await compra.listar();
        res.send({listaItens, listaCompra});
    }

    async comprar(req,res){
        let msg;
        let ok = true;

        let idFunc = req.body.idFunc;
        let idPJ = req.body.idPJ;
        let listaProd = req.body.listaProduto;

        let valorTotal = 0;
        for(let i=0 ;i<listaProd.length;i++){
            valorTotal = valorTotal+(listaProd[i].preco*listaProd[i].qtd);
        }
        console.log(req.body)
        let compra = new CompraModel(null,new Date(),idFunc,null,idPJ,null,valorTotal,1);
        let idCompra = await compra.gravar();
        if(idCompra){
            for(let i=0;i<listaProd.length;i++){
                let itemCompra = new ItensCompraModel(null,idCompra,listaProd[i].idProd,null,listaProd[i].qtd,listaProd[i].preco);
                ok = await itemCompra.gravar();
                if(ok){
                    let Prod = new produtoModel(listaProd[i].idProd);
                    ok = await Prod.atualizarEstoque(listaProd[i].qtd);
                }
                if(!ok){ok = false; msg = 'Erro ao Gravar Item da Compra!'; i=listaProd.length};
            }
            if(ok){
                let hj =  new Date();
                let dataVencimento = hj.setMonth(hj.getMonth()+1);
                let contaPG = new ContaPagarModel(null,1,idCompra,null,valorTotal,new Date(dataVencimento),0,1,1);
                ok = await contaPG.gravar();
                if(ok){
                    msg = 'Compra cadastrada com Sucesso!';
                }
            }
        }
        res.send({ok,msg});
    }

    async detalhesView(req,res){
        let idCompra = req.params.idCompra;
        let compraModel = new CompraModel(idCompra);
        compraModel = await compraModel.buscarPorId();

        let itensCompraModel = new ItensCompraModel(null,idCompra);
        let listaItens = await itensCompraModel.listarPorCompraId();

        let devolucaoCompraModel = new DevolucaoCompraModel(null, idCompra);
        devolucaoCompraModel = await devolucaoCompraModel.buscarPorIdCompra();

        if(devolucaoCompraModel){     //verifica se existe devolução para a compra
            var listaItensDevolucao = [];
            listaItensDevolucao = new ItemDevoCompraModel(null,devolucaoCompraModel.id);
            listaItensDevolucao = await listaItensDevolucao.listarPorDevolucaoId();
        }

        res.render('admin/compras/detalhes.ejs',{layout: 'layout_admin', compraModel, listaItens, listaItensDevolucao});
    }
    async buscarItensCompraPorId(req,res){
        let idCompra = req.params.idCompra;
        let itensCompraModel = new ItensCompraModel(null,idCompra);
        let listaItens = await itensCompraModel.listarPorCompraId();
        res.send(listaItens);
    }
}
module.exports = CompraController;