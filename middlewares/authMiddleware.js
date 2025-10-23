const funcionarioModel = require('../models/funcionarioModel');
class authMiddleware{

    async verificarUsuarioLogado(req, res, next) {
        
        if(req.cookies != undefined && req.cookies.FuncionarioEmail != null && req.cookies.FuncionarioSenha != null){
            let func = new funcionarioModel(null,null,null,null,null,req.cookies.FuncionarioEmail,req.cookies.FuncionarioSenha,null);
            func = await func.logar();
            if(func)
                next();
            else
                res.redirect('/adminLogin')
        }
        else{
            res.redirect('/adminLogin');
        }

        // if(req.cookies != undefined && req.cookies.usuarioLogado != null){
        //     let usuarioId = req.cookies.usuarioLogado;
        //     let usuario = new funcionarioModel();
        //     usuario = await usuario.obter(usuarioId);
        //     if(usuario != null && usuario.usuarioAtivo == 1) {
        //         next();
        //     }
        //     else{
        //         res.redirect("/login");
        //     }
        // }
        // else{
        //     res.redirect("/login");
        // }
    }
}
module.exports = authMiddleware;