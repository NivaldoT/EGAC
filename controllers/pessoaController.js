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

            if(usuario.tipo == 1){
                let func = new PFisicaModel(null,null,null,usuario.email,usuario.senha,null,null);
                func = await func.logarEmailSenha();
                if(func.isFunc){// Se for funcionario Manda para Página admin
                    res.clearCookie('UsuarioEmail');
                    res.clearCookie('UsuarioSenha');
                    res.cookie('FuncionarioEmail', usuario.email);
                    res.cookie('FuncionarioSenha', usuario.senha);
                    ok = true;
                    msg = 'Login de Funcionário realizado com Sucesso!';
                    redirecionarPara = '/admin';
                }
            } else {
                // Se for cliente, salva os cookies e redireciona para '/'
                res.clearCookie('FuncionarioEmail');
                res.clearCookie('FuncionarioSenha');
                res.cookie('UsuarioEmail', usuario.email);
                res.cookie('UsuarioSenha', usuario.senha);
                ok = true;
                msg = 'Login realizado com Sucesso!';
                redirecionarPara = '/';
            }
        } else {
           
            ok = false; //credencial invalida
            msg = 'Email ou Senha Incorretos!';
            redirecionarPara = null;
        }
    
        res.send({ok, msg, redirecionarPara});
    }
}

module.exports = pessoaController;