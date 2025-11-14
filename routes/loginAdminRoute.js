const express = require('express')
const router = express.Router();
const AdminController = require('../controllers/adminController');
const PFController = require('../controllers/PFController');


const adminController = new AdminController();
const pfController = new PFController();

router.get('/', adminController.loginView);
router.get('/Cadastro', adminController.cadastroView);

router.post('/Cadastrar', pfController.cadastrar);

module.exports = router;