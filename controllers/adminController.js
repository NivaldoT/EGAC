const marcaModel = require('../models/marcaModel');
const categoriaModel = require('../models/categoriaModel');
const produtoModel = require('../models/produtoModel');
const equipAgricolaModel = require ('../models/equipAgricolaModel');

class adminController {

    homeView(req, res) {
        res.render('admin/adminHome');
    }
    loginView(req, res) {
        res.render('admin/adminLogin');
    }
    cadastroView(req, res) {
        res.render('admin/adminCadastro');
    }
    async listarView(req,res){
        let listaMarcas = [];
        let marca = new marcaModel();
        listaMarcas = await marca.listar();
        
        let listaCategorias = [];
        let categoria = new categoriaModel();
        listaCategorias = await categoria.listar();

        let listaProdutos = [];
        let produto = new produtoModel();
        listaProdutos = await produto.listar();

        let listaEqAg = [];
        let eqag = new equipAgricolaModel();
        listaEqAg = await eqag.listar();

        res.render('admin/listagem',{listaMarcas: listaMarcas, listaProdutos: listaProdutos, listaEqAg: listaEqAg, listaCategorias: listaCategorias});
    }
    async cadastrarView(req,res){

        let listaMarcas = [];
        let marca = new marcaModel();
        listaMarcas = await marca.listar();

        let listaCategorias = [];
        let categoria = new categoriaModel();
        listaCategorias = await categoria.listar();

        res.render('admin/cadastrarItem',{listaMarcas: listaMarcas, listaCategorias: listaCategorias});
    }
    async alterarView(req,res){

        let id = req.params.id;
        let tipo = req.params.tipo;

        let prod;
        if(tipo == 1 || tipo == 2 || tipo == 3 ){
            prod = new produtoModel();
            prod = await prod.buscarId(id)
        }

        if(tipo == 4){
            prod = new equipAgricolaModel();
            prod = await prod.buscarId(id)
        }

        if(tipo == 5){
            prod = new marcaModel();
            prod = await prod.buscarId(id);
        }
        
        if(tipo == 6){
            prod = new categoriaModel();
            prod = await prod.buscarId(id);
        }
        
        let listaMarcas = [];
        let marca = new marcaModel();
        listaMarcas = await marca.listar();
        
        let listaCategorias = [];
        let categoria = new categoriaModel();
        listaCategorias = await categoria.listar();
        res.render('admin/alterarItem', {prod: prod, tipo: tipo,listaMarcas: listaMarcas, listaCategorias: listaCategorias});
    }

    async excluir(req,res){
        let tipo = req.body.obj.tipo;
        let id = req.body.obj.id;

        let prod;
        if(tipo == 1 || tipo == 2 || tipo == 3){
            prod = new produtoModel();
            let result = await prod.excluir(id);
            if(result)
                res.send({ok: true , msg: 'Produto Excluido com Sucesso!'});
            else
                res.send({ok: false, msg: 'Falha na Exclusão do Produto!'});
        }
        if(tipo == 4){
            prod = new equipAgricolaModel();
            let result = await prod.excluir(id);
            if(result)
                res.send({ok: true , msg: 'Equipamento Agrícola Excluido com Sucesso!'});
            else
                res.send({ok: false, msg: 'Falha na Exclusão do Equipamento Agrícola!'});
        }
        if(tipo == 5){
            prod = new marcaModel();
            let result = await prod.excluir(id);
            if(result)
                res.send({ok: true , msg: 'Marca Excluida com Sucesso!'});
            else
                res.send({ok: false, msg: 'Falha na Exclusão do Marca!'});
        }
        
        if(tipo == 6){
            prod = new categoriaModel();
            let result = await prod.excluir(id);
            if(result)
                res.send({ok: true , msg: 'Categoria Excluida com Sucesso!'});
            else
                res.send({ok: false, msg: 'Falha na Exclusão do Categoria!'});
        }
    }
}

module.exports = adminController;