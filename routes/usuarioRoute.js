const express = require("express");
const UsuarioController = require("../controllers/usuarioController");
const PFController = require("../controllers/PFController");

const router = express.Router();

const usuarioController = new UsuarioController();
const pfController = new PFController();

// rota autenticacao usuario
router.get('/login', usuarioController.loginView); // exibe a tela de login
router.post('/login', pfController.logar); // processa login( func ou cliente)
router.get('/cadastro', usuarioController.cadastroView); // exibe tela de cadastro
router.post('/cadastro', pfController.cadastrar); // processa cadastro de cliente

module.exports = router;