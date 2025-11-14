const express = require("express");
const AdminController = require("../controllers/adminController");
const ProdutosController = require('../controllers/produtosController');
const ServicoController = require('../controllers/servicoController');
const MarcaController = require('../controllers/marcaController');
const CategoriaController = require('../controllers/categoriaController');
const EquipAgricolaController = require('../controllers/equipAgricolaController');

const PFController = require("../controllers/PFController");
const PJController = require("../controllers/PJController");
const PessoaController = require("../controllers/pessoaController");
const OrdemServicoController = require('../controllers/ordemServicoController')
const router = express.Router();

const adminController = new AdminController();
const produtosController = new ProdutosController();
const servicoController = new ServicoController();
const marcaController = new MarcaController();
const categoriaController = new CategoriaController();
const equipAgricolaController = new EquipAgricolaController();

const pfController = new PFController();
const pjController = new PJController();
const pessoaController = new PessoaController();

const ordemServicoController = new OrdemServicoController()

router.get("/", adminController.homeView);

                // Clientes
router.get('/clientes', adminController.clientesView)
router.get('/PFCadastro', adminController.PFCadastroView)
router.get('/PJCadastro', adminController.PJCadastroView)
router.get('/FuncionarioCadastro', adminController.FuncionarioCadastroView)

router.post('/PFCadastro', pfController.cadastrar);
router.post('/PJCadastro', pjController.cadastrar);
router.post('/FuncionarioCadastro', pfController.cadastrar);
router.post('/excluirCliente', adminController.excluirCliente)
router.post('/alterarPF', pfController.alterar);
router.post('/alterarPJ', pjController.alterar);
//router.post('/alterarFuncionario', funcController.alterar);

router.post('/buscarCliente', pessoaController.buscarClienteNome);
router.post('/buscarEqAgricolaCliente', equipAgricolaController.buscarEqAgCliente);
router.post('/buscarFuncionario', pfController.buscarFuncionarioNome);
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


                //ORDEM DE SERVIÇO
router.get('/ordemServicos', ordemServicoController.homeView);
router.get('/ordemServicos/abrir', ordemServicoController.abrirView);
router.get('/ordemServicos/concluir/:id', ordemServicoController.concluirView);
router.get('/ordemServicos/receber/:id', ordemServicoController.homeView);

router.post('/ordemServicos/abrir', ordemServicoController.abrirOS);

router.get('/alterarItem/:tipo/:id', adminController.alterarItemView);
router.get('/alterarCliente/:tipo/:id', adminController.alterarClienteView);
module.exports = router;