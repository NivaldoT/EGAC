const cookieParser = require("cookie-parser");
const PFisicaModel = require("../models/pfisicaModel");
const CompraModel = require("../models/compraModel");
const ItensCompraModel = require("../models/itensCompraModel");
const produtoModel = require("../models/produtoModel");
const ContaPagarModel = require("../models/contaPagarModel");

class CompraController{

    homeView(req,res){
        res.render('admin/compras/home.ejs', {layout:'layout_admin'});
    }
    async comprarView(req,res){
        let func = new PFisicaModel(null,null,null,req.cookies.FuncionarioEmail,req.cookies.FuncionarioSenha,null,null);
        func = await func.logarEmailSenha();
        res.render('admin/compras/comprar.ejs',{layout: 'layout_admin', func});
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
}
module.exports = CompraController;