

class UsuarioController {

    loginView(req, res) {
        res.render('usuario/usuarioLogin');
    }
    cadastroView(req, res) {
        res.render('usuario/usuarioCadastro');
    }
}

module.exports = UsuarioController;