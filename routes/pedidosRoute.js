const express = require('express');
const PedidosController = require('../controllers/pedidosController');
const AuthMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

let ctrl = new PedidosController();
let auth = new AuthMiddleware();

router.get("/", auth.verificarUsuarioLogado, ctrl.pedidosView);
router.get("/listar", auth.verificarUsuarioLogado, ctrl.listarPedidos);
router.post('/gravar', ctrl.gravar);

module.exports = router;
