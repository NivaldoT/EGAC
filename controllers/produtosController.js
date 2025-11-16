const produtoModel = require ('../models/produtoModel');
const categoriaModel = require ('../models/categoriaModel');
const marcaModel = require('../models/marcaModel');

class produtosController{

    // TIPO 1 = PRODUTO
    // TIPO 2 = INSUMO
    async cadastrarView(req,res){
        let listaCategorias = [];
        let categoria = new categoriaModel();
        listaCategorias = await categoria.listar();

        let listaMarcas = [];
        let marca = new marcaModel();
        listaMarcas = await marca.listar();

        res.render('admin/cadastrarProd',{listaCategorias: listaCategorias,listaMarcas: listaMarcas, layout: 'layout_admin'});
    }
    async cadastrar(req,res){
        const tipoItem = req.body.tipoItem;
        const nome = req.body.nome;
        const preco = req.body.preco;
        const descricao = req.body.descricao;
        const categoria = req.body.categoria;
        const marca = req.body.marca;

        let prod = new produtoModel(null,tipoItem,nome,preco,descricao,categoria,null,marca,null,null);
        
        let result = await prod.cadastrar();
        if(result)
            res.send({ok: true, msg: 'Produto cadastrado com Sucesso!'});
        else
            res.send({ok:false, msg: 'Erro ao cadastrar produto!'});
    }
    async alterar(req,res){
        const id = req.body.id;
        const tipoItem = req.body.tipoItem;
        const nome = req.body.nome;
        const preco = req.body.preco;
        const descricao = req.body.descricao;
        const categoria = req.body.categoria;
        const marca = req.body.marca;

        let prod = new produtoModel(id,tipoItem,nome,preco,descricao,categoria,null,marca,null,null);
        
        let result = await prod.alterar();
        if(result)
            res.send({ok: true, msg: 'Produto alterado com Sucesso!'});
        else
            res.send({ok:false, msg: 'Erro ao alterar produto!'});
    }

    async buscarInsumoNome(req,res){
        let nome = '%'+req.body.nome+'%';
        let insumo = new produtoModel(null,null,nome);

        let lista = await insumo.buscarInsumoNome();
        
        res.send({lista});
    }

    async buscarId(req,res){
        let id = req.body.id;
        let prod = new produtoModel();
        prod = await prod.buscarId(id);
        res.send({prod});
    }
}
module.exports = produtosController;