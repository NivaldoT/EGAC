const PFisicaModel = require('../models/pfisicaModel');
class authMiddleware{

    async verificarUsuarioLogado(req, res, next) {
        
        if(req.cookies != undefined && req.cookies.UsuarioEmail != null && req.cookies.UsuarioSenha != null){
            let func = new PFisicaModel(null,null,null,req.cookies.UsuarioEmail,req.cookies.UsuarioSenha);
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