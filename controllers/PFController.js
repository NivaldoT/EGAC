const PFisicaModel = require("../models/pfisicaModel");


class PFController{

    async cadastrar(req,res){
        const nome = req.body.nome;
        const telefone = req.body.telefone;
        const cpf = req.body.cpf;
        const email = req.body.email;
        const senha = req.body.nome;

        let PF = new PFisicaModel(null,nome,telefone,1,cpf,email,senha); //ANTES DE CADASTRAR DEVE VERIFICAR EMAIL E CPF 
        const result = await PF.cadastrar();

        if(result){
            ok = true;
            msg = 'Pessoa Física cadastrada com Sucesso!';
        }else{
            ok = false;
            msg = 'Erro ao cadastrar Pessoa Física!';
        }
        res.send({ok, msg})
    }
}
module.exports = PFController;