const express = require("express");
const AdminController = require("../controllers/adminController");
const ProdutosController = require('../controllers/produtosController');
const ServicoController = require('../controllers/servicoController');
const MarcaController = require('../controllers/marcaController');
const CategoriaController = require('../controllers/categoriaController');
const EquipAgricolaController = require('../controllers/equipAgricolaController');
const FuncionarioController = require('../controllers/funcionarioController');
const router = express.Router();

const adminController = new AdminController();
const produtosController = new ProdutosController();
const servicoController = new ServicoController();
const marcaController = new MarcaController();
const categoriaController = new CategoriaController();
const equipAgricolaController = new EquipAgricolaController();
const funcionarioController = new FuncionarioController();
router.get("/", adminController.homeView);
// router.get('/adminLogin', adminController.loginView);
// router.get('/adminCadastro', adminController.cadastroView);


// router.post('/cadastrar', funcionarioController.cadastrar);
// router.post('/adminLogin', funcionarioController.logar);

                // Clientes
router.get('/clientes', adminController.clientesView)

                // CADASTRAR ITENS
router.get('/cadastrarProduto', produtosController.cadastrarView);
router.get('/cadastrarServico', servicoController.cadastrarView);
router.get('/cadastrarEqAgricola', equipAgricolaController.cadastrarView);
router.get('/cadastrarMarca', marcaController.cadastrarView);
router.get('/cadastrarCategoria', categoriaController.cadastrarView);

router.post('/cadastrarProd', produtosController.cadastrar);
router.post('/cadastrarServico', servicoController.cadastrar);
router.post('/cadastrarEqAgricola', equipAgricolaController.cadastrar);
router.post('/cadastrarMarca', marcaController.cadastrar);
router.post('/cadastrarCategoria', categoriaController.cadastrar);

                // ALTERAR ITENS
router.post('/alterarProduto', produtosController.alterar);
router.post('/alterarMarca', marcaController.alterar);
router.post('/alterarServico', servicoController.alterar);
router.post('/alterarCategoria', categoriaController.alterar);
router.post('/alterarEquipAgricola', equipAgricolaController.alterar);

                // EXCLUIR
router.post('/excluir', adminController.excluirItem);

                // LISTAR ITENS
router.get('/listagem/:tipo', adminController.listarItemView);

router.get('/alterarItem/:tipo/:id', adminController.alterarItemView);
module.exports = router;