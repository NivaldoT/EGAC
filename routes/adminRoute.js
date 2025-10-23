const express = require("express");
const AdminController = require("../controllers/adminController");
const ProdutosController = require('../controllers/produtosController');
const ServicoController = require('../controllers/servicoController');
const MarcaController = require('../controllers/marcaController');
const CategoriaController = require('../controllers/categoriaController');
const EquipAgricolaController = require('../controllers/equipAgricolaController');

const PFController = require("../controllers/PFController");
const PJController = require("../controllers/PJController");
const funcionarioController = require("../controllers/funcionarioController");
const router = express.Router();

const adminController = new AdminController();
const produtosController = new ProdutosController();
const servicoController = new ServicoController();
const marcaController = new MarcaController();
const categoriaController = new CategoriaController();
const equipAgricolaController = new EquipAgricolaController();

const pfController = new PFController();
const pjController = new PJController();
const funcController = new funcionarioController();

router.get("/", adminController.homeView);

                // Clientes
router.get('/clientes', adminController.clientesView)
router.get('/PFCadastro', adminController.PFCadastroView)
// router.get('/PJCadastro', adminController.PJCadastroView)
// router.get('/FuncionarioCadastro', adminController.FuncionarioCadastroView)

router.post('/PFCadastro', pfController.cadastrar);
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