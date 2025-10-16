const produtoModel = require ('../models/produtoModel');
const categoriaModel = require ('../models/categoriaModel');
class produtosController{

    // TIPO 1 = PRODUTO
    // TIPO 2 = INSUMO
    // TIPO 3 = SERVIÇO
    // TIPO 4 = EQUIPAMENTO AGRICOLA
    // TIPO 5 = MARCA

    async cadastrarView(req,res){
        let listaCategorias = [];
        let categoria = new categoriaModel();
        listaCategorias = await categoria.listar();

        res.render('admin/cadastrarProd',{listaCategorias: listaCategorias, layout: 'layout2'});
    }
    async cadastrar(req,res){
        const tipoItem = req.body.tipoItem;
        const nome = req.body.nome;
        const preco = req.body.preco;
        const descricao = req.body.descricao;
        const categoria = req.body.categoria;

        let prod = new produtoModel(null,tipoItem,nome,preco,descricao,categoria);
        
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

        let prod = new produtoModel(id,tipoItem,nome,preco,descricao, categoria);
        
        let result = await prod.alterar();
        if(result)
            res.send({ok: true, msg: 'Produto alterado com Sucesso!'});
        else
            res.send({ok:false, msg: 'Erro ao alterar produto!'});
    }

    
}
module.exports = produtosController;