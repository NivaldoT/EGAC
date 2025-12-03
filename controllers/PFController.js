const PFisicaModel = require("../models/pfisicaModel");


class PFController{

    async cadastrar(req,res){
        const nome = req.body.nome;
        const telefone = req.body.telefone;
        const cpf = req.body.cpf;
        const email = req.body.email;
        const senha = req.body.senha;
        const endereco = req.body.endereco;
        const isFunc = req.body.isFunc;

        let ok = true;
        let msg;
        let PF = new PFisicaModel(null,nome,telefone,email,senha,endereco,cpf,isFunc); //ANTES DE CADASTRAR DEVE VERIFICAR EMAIL E CPF 
        if(await PF.procurarCpf()){
            ok = false;
            msg = 'Já existe um Usuário com este CPF!';
        }
        if(ok && await PF.procurarEmail()){
            ok = false;
            msg = 'Já existe um Usuário com este Email!';
        }
        if(ok){
            let result = await PF.cadastrar();
    
            if(result){
                ok = true;
                msg = 'Conta cadastrada com Sucesso!';
            }else{
                ok = false;
                msg = 'Erro ao cadastrar Pessoa Física!';
            }
        }
        res.send({ok, msg})
    }

    async alterar(req,res){
        let ok = true;
        let msg;

        const id = req.body.id;
        const nome = req.body.nome;
        const telefone = req.body.telefone;
        const cpf = req.body.cpf;
        const email = req.body.email;
        const senha = req.body.senha;
        const endereco = req.body.endereco;
        const isFunc = req.body.isFunc;

        let pessoa = new PFisicaModel(id,nome,telefone,email,senha,endereco,cpf,isFunc);
        // varificação email cpf
        if(await pessoa.procurarCpf() && await pessoa.procurarCpf() != id){ // verifica se ja existe esse cpf cadastrado más deixa passar 
            ok = false;                                   // caso seja da pessoa alterando agora
            msg = 'Já existe um Cliente com Este CPF!';
        }
        if(ok == true && await pessoa.procurarEmail() && await pessoa.procurarEmail() != id){// retorna o id do usuario com o email
            ok = false;                              //caso o email ja esta cadastrado ele verifica se é da pessoa
            msg = 'Já existe um Cliente com Este Email!';     //alterando agora e passa
        }
        if(ok == true){
            let result = await pessoa.alterar();
            if(result){
                ok = true;
                msg = 'Alteração Concluída com Sucesso!';
            }
            else{
                ok = false;
                msg = 'Erro ao Realizar Alteração!';
            }
        }
        res.send({ok,msg});
    }

    async buscarFuncionarioNome(req,res){
        let nome = '%'+req.body.nome+'%';
        let pessoa = new PFisicaModel(null,nome);

        let lista = await pessoa.buscarFuncionarioNome();
        
        res.send({lista});
    }

}
module.exports = PFController;