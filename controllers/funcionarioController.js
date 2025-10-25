const funcionarioModel = require('../models/funcionarioModel');
const PFisicaModel = require('../models/pfisicaModel');
class funcionarioController{

    async cadastrar(req,res){
        const nome = req.body.nome;
        const cpf = req.body.cpf;
        const telefone = req.body.telefone;
        const email = req.body.email;
        const senha = req.body.senha;
        const cargo = req.body.cargo;
        const tipo = 3;

        let func = new funcionarioModel(null, nome, telefone, tipo, email, senha, cpf, cargo);

        let ok = true;
        let msg;
        if(await func.procurarCpf()){
            ok = false;
            msg = 'Já existe um Usuário com este CPF!';
        }
        if(ok && await func.procurarEmail()){
            ok = false;
            msg = 'Já existe um Usuário com este Email!';
        }
        if(ok){
            let result = await func.cadastrar();
    
            if(result){
                ok = true;
                msg = 'Funcionário cadastrado com Sucesso!';
            }else{
                ok = false;
                msg = 'Erro ao cadastrar Funcionário!';
            }
        }
        res.send({ok, msg})
    }

    // async logar(req,res){
    //     const email = req.body.email;
    //     const senha = req.body.senha;

    //     let func = new PFisicaModel(null,null,null,null,email,senha,null);
    //     func = await func.logar();
    //     if(func){
    //         res.cookie('FuncionarioEmail', func.email);
    //         res.cookie('FuncionarioSenha', func.senha);
    //         res.send({ok: true})
    //         // res.redirect('/');
    //     }
    //     else{res.send({ok: false})};
    // }

    async alterar(req,res){
        let ok = true;
        let msg;

        const id = req.body.id;
        const nome = req.body.nome;
        const telefone = req.body.telefone;
        const cpf = req.body.cpf;
        const cargo = req.body.cargo;
        const email = req.body.email;
        const senha = req.body.senha;

        let pessoa = new funcionarioModel(id,nome,telefone,3,email,senha,cpf,cargo);
        // varificação email cpf
        if(await pessoa.procurarCpf() && await pessoa.procurarCpf() != id){ // verifica se ja existe esse cpf cadastrado más deixa passar 
            ok = false;                                                     // caso seja da pessoa alterando agora
            msg = 'Já existe um Usuário com Este CPF!';
        }
        if(ok == true && await pessoa.procurarEmail() && await pessoa.procurarEmail() != id){// retorna o id do usuario com o email
            ok = false;                                                     //caso o email ja esta cadastrado ele verifica se é da pessoa
            msg = 'Já existe um Usuário com Este Email!';                   //alterando agora e passa
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
}

module.exports = funcionarioController;