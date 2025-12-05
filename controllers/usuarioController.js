const pessoaModel = require("../models/pessoaModel");


class UsuarioController {

    loginView(req, res) {
        res.render('usuario/usuarioLogin');
    }
    cadastroView(req, res) {
        res.render('usuario/usuarioCadastro');
    }
    async perfilView(req,res){
        let usuario = new pessoaModel(null,null,null,null,req.cookies.UsuarioEmail, req.cookies.UsuarioSenha);
        usuario = await usuario.logarEmailSenha();
        res.render('usuario/perfil', {usuario});
    }
}

module.exports = UsuarioController;