const pessoaModel = require('../models/pessoaModel');
const PFisicaModel = require('../models/pfisicaModel');

class pessoaController{
    async buscarClienteNome(req,res){
        let nome = req.body.nome;
        nome = '%'+nome+'%';
        let pessoa = new pessoaModel(null,nome);

        let lista = await pessoa.buscarClienteNome();
        
        res.send({lista});
    }

    async logar(req,res){
        //funcao de logar unificada

        const email = req.body.email;
        const senha = req.body.senha; // email e senha

        let ok;
        let msg;
        let redirecionarPara;

        // let usuario = new PFisicaModel(null,null,null,email,senha,null,null); // objeto com os dados do login
        let usuario = new pessoaModel(null,null,null,null,email,senha); // monta a pessoa
        
        usuario = await usuario.logarEmailSenha(); //busca se existe o usuario com esse email e senha
        
        //se encontrar, verifica se é funcionario
        if(usuario){
            res.cookie('UsuarioEmail', usuario.email);
            res.cookie('UsuarioSenha', usuario.senha);
            res.cookie('UsuarioNome', usuario.nome);
            ok = true;
            msg = 'Login Realizado com Sucesso!';
        } else {
           
            ok = false; //credencial invalida
            msg = 'Email ou Senha Incorretos!';
            redirecionarPara = null;
        }
    
        res.send({ok, msg, redirecionarPara});
    }

    async buscarPessoaLogin(req,res){
        let ok;
        let email = req.cookies.UsuarioEmail;
        let senha = req.cookies.UsuarioSenha;

        let pessoa = new PFisicaModel(null,null,null,email,senha);
        pessoa = await pessoa.logarEmailSenha();

        if(pessoa && pessoa.isFunc)
            ok = true;
        else
            ok = false;
        res.send({ok});
    }
}

module.exports = pessoaController;