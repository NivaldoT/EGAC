const express = require("express");
const UsuarioController = require("../controllers/usuarioController");
const PFController = require("../controllers/PFController");
const pessoaController = require("../controllers/pessoaController");
const HomeController = require("../controllers/homeController");
const DevolucaoController = require("../controllers/devolucaoController");

const router = express.Router();

const usuarioController = new UsuarioController();
const pfController = new PFController();
const PessoaController = new pessoaController();
const homeController = new HomeController();
const devolucaoController = new DevolucaoController()

// rota autenticacao usuario
router.get('/login', usuarioController.loginView); // exibe a tela de login
router.get('/cadastro', usuarioController.cadastroView); // exibe tela de cadastro
router.get('/perfil', usuarioController.perfilView); // exibe tela de perfil
router.get('/logout', usuarioController.logout); // logout
//router.post('/login', pfController.logar); // processa login( func ou cliente)
router.post('/login', PessoaController.logar); // pessoa engloba PJ Tambem
router.post('/cadastro', pfController.cadastrar); // processa cadastro de cliente
router.post('/perfil/atualizar', usuarioController.atualizarPerfil); // atualiza perfil

router.get('/buscarPessoaLogin', PessoaController.buscarPessoaLogin);

router.get('/minhas-compras', usuarioController.minhasComprasView);
router.get('/minhas-devolucoes', devolucaoController.minhasDevolucoes);
router.get('/devolucao/:id', devolucaoController.visualizarDevolucao);
router.post('/solicitar-devolucao', devolucaoController.solicitarDevolucao);

module.exports = router;