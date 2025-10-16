const categoriaModel = require('../models/categoriaModel');

class categoriaController{

    // TIPO 1 = PRODUTO
    // TIPO 2 = INSUMO
    // TIPO 3 = EQUIPAMENTO AGRICOLA
    // TIPO 4 = categoria
    // TIPO 5 = SERVIÇO

    async cadastrarView(req,res){
        res.render('admin/cadastrarCategoria', {layout: 'layout2'});
    }
    async cadastrar(req,res){
        const nome = req.body.nome;

        const categoria = new categoriaModel(null,nome);
        const result = await categoria.cadastrar();

        if(result)
            res.send({msg: 'Categoria cadastrada com Sucesso!'});
        else
            res.send({msg: 'Erro ao cadastrar Categoria!'});
    }

    async alterar(req,res){
        const categoria = new categoriaModel(req.body.id,req.body.nome);
        const result = await categoria.alterar();
        
        if(result)
            res.send({msg: 'Categoria alterada com Sucesso!'});
        else
            res.send({msg: 'Erro ao alterar Categoria!'});
    }
}
module.exports = categoriaController;