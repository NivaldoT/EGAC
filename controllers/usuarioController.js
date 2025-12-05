const pessoaModel = require('../models/pessoaModel');
const pfisicaModel = require('../models/pfisicaModel');

class UsuarioController {

    loginView(req, res) {
        res.render('usuario/usuarioLogin');
    }
    cadastroView(req, res) {
        res.render('usuario/usuarioCadastro');
    }

    async perfilView(req, res) {
        try {
            const email = req.cookies.UsuarioEmail;
            const senha = req.cookies.UsuarioSenha;

            if (!email || !senha) {
                return res.redirect('/usuario/login');
            }

            // Buscar dados da pessoa
            let pessoa = new pessoaModel(null, null, null, null, email, senha);
            pessoa = await pessoa.logarEmailSenha();

            if (!pessoa) {
                return res.redirect('/usuario/login');
            }

            // Buscar dados de PF se for pessoa física
            let dadosPF = null;
            if (pessoa.tipo == 1) {
                let pf = new pfisicaModel(null, null, null, email, senha);
                dadosPF = await pf.logarEmailSenha();
            }

            res.render('usuario/usuarioPerfil', { pessoa, dadosPF });
        } catch (error) {
            console.error('Erro ao carregar perfil:', error);
            res.redirect('/usuario/login');
        }
    }

    async atualizarPerfil(req, res) {
        try {
            const email = req.cookies.UsuarioEmail;
            const senha = req.cookies.UsuarioSenha;

            if (!email || !senha) {
                return res.send({ ok: false, msg: 'Usuário não autenticado' });
            }

            const { nome, telefone, endereco, novaSenha } = req.body;

            // Buscar pessoa atual
            let pessoa = new pessoaModel(null, null, null, null, email, senha);
            pessoa = await pessoa.logarEmailSenha();

            if (!pessoa) {
                return res.send({ ok: false, msg: 'Usuário não encontrado' });
            }

            // Atualizar dados
            const senhaFinal = novaSenha || senha;
            let pessoaAtualizada = new pessoaModel(
                pessoa.id,
                nome,
                telefone,
                pessoa.tipo,
                email,
                senhaFinal,
                endereco
            );

            const resultado = await pessoaAtualizada.atualizar();

            if (resultado) {
                // Atualizar cookies se senha foi alterada
                if (novaSenha) {
                    res.cookie('UsuarioSenha', novaSenha);
                }
                res.cookie('UsuarioNome', nome);

                res.send({ ok: true, msg: 'Perfil atualizado com sucesso!' });
            } else {
                res.send({ ok: false, msg: 'Erro ao atualizar perfil' });
            }
        } catch (error) {
            console.error('Erro ao atualizar perfil:', error);
            res.send({ ok: false, msg: 'Erro ao atualizar perfil' });
        }
    }
}

module.exports = UsuarioController;