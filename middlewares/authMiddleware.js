const PFisicaModel = require('../models/pfisicaModel');
const jwt = require('jsonwebtoken');
class authMiddleware{

    async verificarUsuarioLogado(req, res, next) {
                                    // && req.cookies != undefined && req.cookies.UsuarioEmail != null && req.cookies.UsuarioSenha != null
        if(req.cookies.tokenUsuario){
            // let func = new PFisicaModel(null,null,null,req.cookies.UsuarioEmail,req.cookies.UsuarioSenha);
            // func = await func.logarEmailSenha();
            let func = jwt.verify(req.cookies.tokenUsuario, process.env.segredo);
            //console.log(func)
            //console.log(jwt.verify(req.cookies.tokenUsuario, process.env.segredo));
            if(func && func.isFunc && func.exp>(Date.now()/1000))
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