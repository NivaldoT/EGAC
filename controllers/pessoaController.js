const pessoaModel = require('../models/pessoaModel');

class pessoaController{
    async buscarCliente(req,res){
        let nome = req.body.nome;
        nome = '%'+nome+'%';
        let pessoa = new pessoaModel(null,nome);

        let lista = await pessoa.buscarCliente();
        
        res.send({lista});
    }
}

module.exports = pessoaController;