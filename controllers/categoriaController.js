const categoriaModel = require('../models/categoriaModel');

class categoriaController{

    // TIPO 1 = PRODUTO
    // TIPO 2 = INSUMO
    // TIPO 3 = EQUIPAMENTO AGRICOLA
    // TIPO 4 = categoria
    // TIPO 5 = SERVIÇO

    async cadastrarView(req,res){
        res.render('admin/cadastrarCategoria', {layout: 'layout_admin'});
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

    async excluir(req,res) {
        const categoria = new categoriaModel(req.body.id,req.body.nome);

        // Verificar se há produtos vinculados
        const temProdutos = await categoria.verificarProdutos();
        if(temProdutos > 0){
            console.log('não pode excluir, existem produtos vinculados');
            res.send({msg: `Não é possível excluir esta categoria! Existem ${temProdutos} produto(s) vinculado(s) a ela.`});
            return;
        }

        // Verificar se há equipamentos vinculados
        const temEquipamentos = await categoria.verificarEquipamentos();
        if(temEquipamentos > 0){
            console.log('não pode excluir, existem equipamentos vinculados');
            res.send({msg: `Não é possível excluir esta categoria! Existem ${temEquipamentos} equipamento(s) agrícola(s) vinculado(s) a ela.`});
            return;
        }

        const result = await categoria.excluir(req.body.id);

        if(result) 
            res.send({msg: 'Categoria excluída com Sucesso!'});
        else
            res.send({msg: 'Erro ao excluir Categoria!'});
    }
}
module.exports = categoriaController;


