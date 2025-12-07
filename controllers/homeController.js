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

    
    
}
module.exports = HomeController;