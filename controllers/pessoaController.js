const pessoaModel = require('../models/pessoaModel');

class pessoaController{
    async buscarClienteNome(req,res){
        let nome = req.body.nome;
        nome = '%'+nome+'%';
        let pessoa = new pessoaModel(null,nome);

        let lista = await pessoa.buscarClienteNome();
        
        res.send({lista});
    }
}

module.exports = pessoaController;