const express = require("express");
const multer = require("multer");
const AdminController = require("../controllers/adminController");
const ProdutosController = require('../controllers/produtosController');
const ServicoController = require('../controllers/servicoController');
const MarcaController = require('../controllers/marcaController');
const CategoriaController = require('../controllers/categoriaController');
const EquipAgricolaController = require('../controllers/equipAgricolaController');

const PFController = require("../controllers/PFController");
const PJController = require("../controllers/PJController");
const PessoaController = require("../controllers/pessoaController");
const OrdemServicoController = require('../controllers/ordemServicoController');
const PedidosController = require('../controllers/pedidosController');
const CompraController = require("../controllers/compraController");
const ContasController = require("../controllers/contasController");
const CaixaController = require("../controllers/caixaController");
const DevolucaoController = require("../controllers/devolucaoController");
const MovimentoController = require('../controllers/movimentoController');
const router = express.Router();

// Configuração do Multer para upload de imagens
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'public/images/produtos');
    },
    filename: function(req, file, cb) {
        let nomeArq = "PROD-" + Date.now();
        let ext = file.originalname.split(".").pop();
        cb(null, `${nomeArq}.${ext}`);
    }
});

const upload = multer({ storage: storage });

const adminController = new AdminController();
const produtosController = new ProdutosController();
const servicoController = new ServicoController();
const marcaController = new MarcaController();
const categoriaController = new CategoriaController();
const equipAgricolaController = new EquipAgricolaController();

const pfController = new PFController();
const pjController = new PJController();
const pessoaController = new PessoaController();

const ordemServicoController = new OrdemServicoController();
const pedidosController = new PedidosController();

const compraController = new CompraController();

const contasController = new ContasController()


// CAIXA
// const caixaController = require("../controllers/caixaController");
const caixaController = new CaixaController();
const movimentoController = new MovimentoController();

const devolucaoController = new DevolucaoController();

router.get("/", adminController.homeView);

                // Clientes
router.get('/clientes', adminController.clientesView)
router.get('/clientes/:tipo', adminController.clientesView)
router.get('/PFCadastro', adminController.PFCadastroView)
router.get('/PJCadastro', adminController.PJCadastroView)
router.get('/FuncionarioCadastro', adminController.FuncionarioCadastroView)

router.post('/PFCadastro', pfController.cadastrar);
router.post('/PJCadastro', pjController.cadastrar);
router.post('/FuncionarioCadastro', pfController.cadastrar);
router.post('/excluirCliente', adminController.excluirCliente)
router.post('/alterarPF', pfController.alterar);
router.post('/alterarPJ', pjController.alterar);

router.post('/buscarCliente', pessoaController.buscarClienteNome);
router.post('/buscarEqAgricolaCliente', equipAgricolaController.buscarEqAgCliente);
router.post('/buscarFuncionario', pfController.buscarFuncionarioNome);
router.post('/buscarFornecedor', pjController.buscarFornecedorNome);

router.post('/buscarInsumoNome', produtosController.buscarInsumoNome);
router.post('/buscarProdutoNome', produtosController.buscarProdutoNome);
router.post('/buscarProdPorId', produtosController.buscarId)
router.post('/atualizarEstoque', produtosController.atualizarEstoque)
                // CADASTRAR ITENS
router.get('/cadastrarProduto', produtosController.cadastrarView);
router.get('/cadastrarServico', servicoController.cadastrarView);
router.get('/cadastrarEqAgricola', equipAgricolaController.cadastrarView);
router.get('/cadastrarMarca', marcaController.cadastrarView);
router.get('/cadastrarCategoria', categoriaController.cadastrarView);

router.post('/cadastrarProd', upload.single('imagem'), produtosController.cadastrar);
router.post('/cadastrarServico', servicoController.cadastrar);
router.post('/cadastrarEqAgricola', equipAgricolaController.cadastrar);
router.post('/cadastrarMarca', marcaController.cadastrar);
router.post('/cadastrarCategoria', categoriaController.cadastrar);

                // ALTERAR ITENS
router.post('/alterarProduto', upload.single('imagem'), produtosController.alterar);
router.post('/alterarMarca', marcaController.alterar);
router.post('/alterarServico', servicoController.alterar);
router.post('/alterarCategoria', categoriaController.alterar);
router.post('/alterarEquipAgricola', equipAgricolaController.alterar);
router.get('/alterarItem/:tipo/:id', adminController.alterarItemView);
router.get('/alterarCliente/:tipo/:id', adminController.alterarClienteView);
                // EXCLUIR
router.post('/excluir', adminController.excluirItem);

                // LISTAR ITENS
router.get('/listagem/:tipo', adminController.listarItemView);


                //ORDEM DE SERVIÇO
router.get('/ordemServicos', ordemServicoController.homeView);
router.get('/ordemServicos/abrir', ordemServicoController.abrirView);
router.get('/ordemServicos/listar',ordemServicoController.listar);
router.get('/ordemServicos/concluir/:id', ordemServicoController.concluirView);
router.get('/ordemServicos/receber/:id', ordemServicoController.receberView);


router.post('/ordemServicos/abrir', ordemServicoController.abrirOS);
router.post('/ordemServicos/concluir', ordemServicoController.concluirOS);
router.post('/ordemServicos/receber', ordemServicoController.receberOS);

                //VENDAS/PEDIDOS
router.get('/vendas', pedidosController.pedidosView);
router.get('/vendas/listar', pedidosController.listarPedidos);
router.get('/vendas/detalhes/:id', pedidosController.detalhesView);

                //COMPRAS   
router.get('/compras', compraController.homeView);
router.get('/comprar', compraController.comprarView);
router.get('/compras/listar', compraController.listar);
router.post('/comprar', compraController.comprar);
router.get('/compras/detalhes/:idCompra', compraController.detalhesView);
router.get('/buscarItensCompraPorId/:idCompra', compraController.buscarItensCompraPorId);
                //CONTAS A RECEBER
                
router.get('/contas/listar',contasController.listar);
router.post('/contas/receber', contasController.receber);
router.post('/contas/pagar', contasController.pagar);

router.get('/contas/:tipo', contasController.contasView);

                //MOVIMENTOS
router.get('/movimentos/buscarDeCaixa/:idCaixa', movimentoController.buscarDeCaixa);
// router.get('/caixa', (req, res) => res.render('admin/caixa/index', {layout: 'layout_admin'}));       ACHO QUE NÃO PRECISA DESSAS FUNÇÕES
// router.get('/caixa/getStatus', function(req, res) { caixaController.getStatus(req, res); });
// router.post('/caixa/abrir', function(req, res) { caixaController.abrir(req, res); });
// router.post('/caixa/fechar', function(req, res) { caixaController.fechar(req, res); });
// router.get('/caixa/resumo', function(req, res) { caixaController.resumoCaixa(req, res); });
// router.post('/caixa/movimento', function(req, res) { movimentoController.registrarMovimento(req, res); });

                // CAIXA
router.get('/caixa', caixaController.caixaView);
router.get('/caixa/getStatus', caixaController.getStatus);
// router.get('/caixa/resumo', caixaController.resumoCaixa);

router.post('/caixa/abrir', caixaController.abrir);
router.post('/caixa/fechar', caixaController.fechar);
router.post('/caixa/movimento', movimentoController.registrarMovimento);

                // DEVOLUÇÕES
router.get('/devolucoes', devolucaoController.listarDevolucoes);
router.post('/devolverCompra', devolucaoController.devolverCompra);
router.get('/devolucoes/:id', devolucaoController.visualizarDevolucao);
router.post('/devolucoes/:id/aprovar', devolucaoController.aprovarDevolucao);
router.post('/devolucoes/:id/recusar', devolucaoController.recusarDevolucao);

                // DASHBOARD
router.get('/dashboard/resumo', adminController.dashboardResumo);
router.get('/dashboard/vendas', adminController.dashboardVendas);
router.get('/dashboard/alertas-estoque', adminController.dashboardAlertasEstoque);

// router.get('/alterarItem/:tipo/:id', adminController.alterarItemView);
// router.get('/alterarCliente/:tipo/:id', adminController.alterarClienteView);
module.exports = router;