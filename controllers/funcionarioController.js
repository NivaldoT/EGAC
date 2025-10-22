const funcionarioModel = require('../models/funcionarioModel')
class funcionarioController{

    async cadastrar(req,res){
        const nome = req.body.nome;
        const cpf = req.body.cpf;
        const telefone = req.body.telefone;
        const email = req.body.email;
        const senha = req.body.senha;

        let funcionario = new funcionarioModel(null,nome,telefone,cpf,email,senha,'admin');
        let result = await funcionario.cadastrar();
        if(result){ res.send({msg: 'Funcionário Cadastrado com Sucesso!'})}
        else{res.send({msg:'Erro a cadastrar Funcionário!'})};
    }

    async logar(req,res){
        const email = req.body.email;
        const senha = req.body.senha;

        let func = new funcionarioModel(null,null,null,null,email,senha,null);
        func = await func.logar();
        if(func){
            res.cookie('FuncionarioEmail', func.email);
            res.cookie('FuncionarioSenha', func.senha);
            res.send({ok: true})
            // res.redirect('/');
        }
        else{res.send({ok: false})};
    }
}

module.exports = funcionarioController;