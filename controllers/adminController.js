const marcaModel = require('../models/marcaModel');
const categoriaModel = require('../models/categoriaModel');
const produtoModel = require('../models/produtoModel');
const equipAgricolaModel = require ('../models/equipAgricolaModel');
const ServicoModel = require ('../models/servicoModel');

class adminController {

    homeView(req, res) {
        res.render('admin/adminHome',{layout: 'layout2'});
    }
    loginView(req, res) {
        res.render('admin/adminLogin',{layout: 'layout2'});
    }
    cadastroView(req, res) {
        res.render('admin/adminCadastro',{layout: 'layout2'});
    }
    async listarItemView(req,res){
        let tipoListar = req.params.tipo;

        let listaMarcas = [];
        let marca = new marcaModel();
        listaMarcas = await marca.listar();
        
        let listaCategorias = [];
        let categoria = new categoriaModel();
        listaCategorias = await categoria.listar();

        let listaProdutos = [];
        let listaInsumos = [];
        let produto = new produtoModel();
        listaProdutos = await produto.listarProd();
        listaInsumos = await produto.listarInsumo();

        let listaEqAg = [];
        let eqag = new equipAgricolaModel();
        listaEqAg = await eqag.listar();
        
        let listaServicos = [];
        let Servicos = new ServicoModel();
        listaServicos = await Servicos.listar();

        res.render('admin/listagem',{listaMarcas: listaMarcas, listaProdutos: listaProdutos,listaInsumos: listaInsumos, listaEqAg: listaEqAg, listaCategorias: listaCategorias, listaServicos: listaServicos,tipoListar: tipoListar, layout: 'layout2'});
    }
    async alterarItemView(req,res){

        let id = req.params.id;
        let tipo = req.params.tipo;

        let prod;
        if(tipo == 1 || tipo == 2){
            prod = new produtoModel();
            prod = await prod.buscarId(id)
        }
        if(tipo == 3){
            prod = new ServicoModel();
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
        res.render('admin/alterarItem', {prod: prod, tipo: tipo,listaMarcas: listaMarcas, listaCategorias: listaCategorias, layout: 'layout2'});
    }
    async excluirItem(req,res){
        let tipo = req.body.obj.tipo;
        let id = req.body.obj.id;

        let prod;
        if(tipo == 1 || tipo == 2){
            prod = new produtoModel();
            let result = await prod.excluir(id);
            if(result)
                res.send({ok: true , msg: 'Produto Excluido com Sucesso!'});
            else
                res.send({ok: false, msg: 'Falha na Exclusão do Produto!'});
        }
        if(tipo == 3){
            prod = new ServicoModel();
            let result = await prod.excluir(id);
            if(result)
                res.send({ok: true , msg: 'Serviço Excluido com Sucesso!'});
            else
                res.send({ok: false, msg: 'Falha na Exclusão do Serviço!'});
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

    clientesView(req,res){
        
        res.render('admin/adminClientes',{layout: 'layout2'});
    }
}

module.exports = adminController;