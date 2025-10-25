const express = require('express')
const router = express.Router();
const AdminController = require('../controllers/adminController');
const FuncionarioController = require('../controllers/funcionarioController');
const PFController = require('../controllers/PFController');


const adminController = new AdminController();
const funcionarioController = new FuncionarioController();
const pfController = new PFController();

router.get('/', adminController.loginView);
router.get('/Cadastro', adminController.cadastroView);

            //adminLogin
router.post('/', pfController.logarFuncionario);
router.post('/Cadastrar', pfController.cadastrarFuncionario);

module.exports = router;