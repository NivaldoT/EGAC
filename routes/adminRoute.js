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
router.get('/PJCadastro', adminController.PJCadastroView)
router.get('/FuncionarioCadastro', adminController.FuncionarioCadastroView)

router.post('/PFCadastro', pfController.cadastrar);
router.post('/PJCadastro', pjController.cadastrar);
router.post('/FuncionarioCadastro', funcController.cadastrar);
router.post('/excluirCliente', adminController.excluirCliente)
router.post('/alterarPF', pfController.alterar);
router.post('/alterarPJ', pjController.alterar);
router.post('/alterarFuncionario', funcController.alterar);

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
router.get('/alterarCliente/:tipo/:id', adminController.alterarClienteView);
module.exports = router;