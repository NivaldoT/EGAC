const marcaModel = require('../models/marcaModel');

class marcaController{

    // TIPO 1 = PRODUTO
    // TIPO 2 = INSUMO
    // TIPO 3 = EQUIPAMENTO AGRICOLA
    // TIPO 4 = MARCA
    // TIPO 5 = SERVIÇO

    async cadastrarView(req,res){
        res.render('admin/cadastrarMarca',{ layout: 'layout2'});
    }
    async cadastrar(req,res){
        const nome = req.body.nome;

        const marca = new marcaModel(null,nome);
        const result = await marca.cadastrar();
        
        if(result)
            res.send({msg: 'Marca cadastrada com Sucesso!'});
        else
            res.send({msg: 'Erro ao cadastrar marca!'});
    }

    async alterar(req,res){
        const marca = new marcaModel(req.body.id,req.body.nome);
        const result = await marca.alterar();
        
        if(result)
            res.send({msg: 'Marca alterada com Sucesso!'});
        else
            res.send({msg: 'Erro ao alterar marca!'});
    }
}
module.exports = marcaController;