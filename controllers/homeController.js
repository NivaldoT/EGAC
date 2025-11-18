const CategoriaModel = require('../models/categoriaModel');
const ProdutoModel = require('../models/produtoModel');

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
    cartView(req, res) {
        res.render('shop/cart');
    }
    contactView(req, res) {
        res.render('home/contact');
    }
}
module.exports = HomeController;