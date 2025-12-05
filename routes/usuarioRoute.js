const express = require("express");
const UsuarioController = require("../controllers/usuarioController");
const PFController = require("../controllers/PFController");
const pessoaController = require("../controllers/pessoaController");

const router = express.Router();

const usuarioController = new UsuarioController();
const pfController = new PFController();
const PessoaController = new pessoaController();

// rota autenticacao usuario
router.get('/login', usuarioController.loginView); // exibe a tela de login
router.get('/cadastro', usuarioController.cadastroView); // exibe tela de cadastro
router.get('/perfil', usuarioController.perfilView); // exibe tela de perfil
//router.post('/login', pfController.logar); // processa login( func ou cliente)
router.post('/login', PessoaController.logar); // pessoa engloba PJ Tambem
router.post('/cadastro', pfController.cadastrar); // processa cadastro de cliente
router.post('/perfil/atualizar', usuarioController.atualizarPerfil); // atualiza perfil

router.get('/buscarPessoaLogin', PessoaController.buscarPessoaLogin);

module.exports = router;