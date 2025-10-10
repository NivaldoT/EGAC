const express = require("express");
const AdminController = require("../controllers/adminController");
const ProdutosController = require('../controllers/produtosController');
const MarcaController = require('../controllers/marcaController');
const CategoriaController = require('../controllers/categoriaController');
const EquipAgricolaController = require('../controllers/equipAgricolaController');
const router = express.Router();

const adminController = new AdminController();
const produtosController = new ProdutosController();
const marcaController = new MarcaController();
const categoriaController = new CategoriaController();
const equipAgricolaController = new EquipAgricolaController();
router.get("/", adminController.homeView);
router.get('/adminLogin', adminController.loginView);
router.get('/adminCadastro', adminController.cadastroView);

router.get('/listagem', adminController.listarView);
router.get('/cadastrarItem', adminController.cadastrarView);
router.post('/excluir', adminController.excluir);
router.post('/cadastrarItem', produtosController.cadastrar);
router.post('/alterarProduto', produtosController.alterar);
router.post('/cadastrarMarca', marcaController.cadastrar);
router.post('/alterarMarca', marcaController.alterar);
router.post('/cadastrarCategoria', categoriaController.cadastrar);
router.post('/alterarCategoria', categoriaController.alterar);
router.post('/cadastrarEquipAgricola', equipAgricolaController.cadastrar);
router.post('/alterarEquipAgricola', equipAgricolaController.alterar);


router.get('/alterarItem/:tipo/:id', adminController.alterarView);
module.exports = router;
