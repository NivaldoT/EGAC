const PFisicaModel = require('../models/pfisicaModel');
class authMiddleware{

    async verificarUsuarioLogado(req, res, next) {
        
        if(req.cookies != undefined && req.cookies.FuncionarioEmail != null && req.cookies.FuncionarioSenha != null){
            let func = new PFisicaModel(null,null,null,req.cookies.FuncionarioEmail,req.cookies.FuncionarioSenha,null,null);
            func = await func.logarEmailSenha();
            if(func && func.isFunc)
                next();
            else
                res.redirect('/usuario/login');
        }
        else{
            res.redirect('/usuario/login');
        }
    }
}
module.exports = authMiddleware;