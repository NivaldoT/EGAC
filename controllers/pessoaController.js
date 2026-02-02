const pessoaModel = require('../models/pessoaModel');
const PFisicaModel = require('../models/pfisicaModel');

const jwt = require('jsonwebtoken');
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
        
        if(usuario){
            let usuarioFunc = new PFisicaModel(usuario.id);
            usuarioFunc = await usuarioFunc.buscarId()
            let isFunc; //verifica se é funcionario para Adicionar no token JWT
            if(usuarioFunc.isFunc)
                isFunc = true;
            else
                isFunc = false;

            res.cookie('UsuarioEmail', usuario.email);
            res.cookie('UsuarioSenha', usuario.senha);
            res.cookie('UsuarioNome', usuario.nome);
            ok = true;
            msg = 'Login Realizado com Sucesso!';
            var token = jwt.sign({
                id: usuario.id,
                isFunc: isFunc,
                exp: Math.floor(Date.now()/1000) + (60*60)
            }, process.env.segredo);
            res.cookie('tokenUsuario', token);
        } else {
           
            ok = false; //credencial invalida
            msg = 'Email ou Senha Incorretos!';
            redirecionarPara = null;
        }
        res.send({ok, msg, redirecionarPara});
    }

    async buscarPessoaLogin(req,res){
        let ok;
        // let pessoa = new PFisicaModel(null,null,null,email,senha); //antes precisava ver no banco de dados sempre
        // pessoa = await pessoa.logarEmailSenha();

        let token = req.cookies.tokenUsuario;     //recebe o token do navegador, decodifica e vê se é funcionário
        if(token){

            let pessoa = jwt.verify(token, process.env.segredo);
            
            if(pessoa && pessoa.isFunc)
                ok = true;
            else
                ok = false;
        }
        res.send({ok});
    }
}

module.exports = pessoaController;