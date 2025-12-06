const CategoriaModel = require('../models/categoriaModel');
const ProdutoModel = require('../models/produtoModel');
const VendaModel = require('../models/pedidoModel');
const ItemVendaModel = require('../models/pedidoItemModel');
const DevolucaoVendaModel = require('../models/devolucaoVendaModel');
const pessoaModel = require('../models/pessoaModel');

class HomeController {
    homeView(req, res) {
        res.render('home/home');
    }

    async shopView(req, res) {
        let categoriaModel = new CategoriaModel();              
        let listaCategorias = await categoriaModel.listar();
        
        let produtoModel = new ProdutoModel();
        let listaProdutos = await produtoModel.listar();
        
        res.render('shop/shop', {listaCategorias: listaCategorias, listaProdutos: listaProdutos});
    }
    aboutView(req, res) {
        res.render('home/about');
    }
    blogView(req, res) {
        res.render('home/blog');
    }
    async cartView(req, res) {
        let usuario = new pessoaModel(null,null,null,null,req.cookies.UsuarioEmail, req.cookies.UsuarioSenha);
        usuario = await usuario.logarEmailSenha();
        res.render('shop/cart', {usuario});
    }
    contactView(req, res) {
        res.render('home/contact');
    }

    async minhasComprasView(req, res) {
        try {
            // Pegar email do cookie
            const userEmail = req.cookies.UsuarioEmail;
            const userSenha = req.cookies.UsuarioSenha;
            
            if (!userEmail) {
                return res.redirect('/usuario/login');
            }

            // Buscar vendas do cliente
            let vendaModel = new VendaModel();
            let vendas = await vendaModel.listarPorCliente(userEmail);

            // Para cada venda, buscar os itens e verificar se há devolução
            let itemVendaModel = new ItemVendaModel();
            let devolucaoModel = new DevolucaoVendaModel();
            
            for(let venda of vendas) {
                venda.itens = await itemVendaModel.listarPorVenda(venda.id);
                // Verificar se existe devolução para esta venda
                venda.devolucao = await devolucaoModel.verificarDevolucaoExistente(venda.id);
            }

            res.render('shop/minhas-compras', { vendas: vendas });
        } catch (error) {
            console.error('Erro ao buscar compras:', error);
            res.status(500).send('Erro ao carregar suas compras');
        }
    }
}
module.exports = HomeController;