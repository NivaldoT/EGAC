const cookieParser = require("cookie-parser");
const PFisicaModel = require("../models/pfisicaModel");

class CompraController{

    homeView(req,res){
        res.render('admin/compras/home.ejs', {layout:'layout_admin'});
    }
    async comprarView(req,res){
        let func = new PFisicaModel(null,null,null,req.cookies.FuncionarioEmail,req.cookies.FuncionarioSenha,null,null);
        func = await func.logarEmailSenha();
        res.render('admin/compras/comprar.ejs',{layout: 'layout_admin', func});
    }
}
module.exports = CompraController;