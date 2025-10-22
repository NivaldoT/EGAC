const express = require('express')
const router = express.Router();
const AdminController = require('../controllers/adminController');
const FuncionarioController = require('../controllers/funcionarioController');


const adminController = new AdminController();
const funcionarioController = new FuncionarioController();

router.get('/', adminController.loginView);
router.get('/Cadastro', adminController.cadastroView);

            //adminLogin
router.post('/', funcionarioController.logar);
router.post('/Cadastrar', funcionarioController.cadastrar);

module.exports = router;