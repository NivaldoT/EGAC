const PJModel = require("../models/pjuridicaModel");

class PJController{

    async cadastrar(req,res){
        const nome = req.body.nome;
        const telefone = req.body.telefone;
        const email = req.body.email;
        const senha = req.body.senha;
        const endereco = req.body.endereco;
        const cnpj = req.body.cnpj;

        let ok = true;
        let msg;
        let PJ = new PJModel(null,nome,telefone,email,senha,endereco,cnpj); //ANTES DE CADASTRAR DEVE VERIFICAR EMAIL E CNPJ 
        if(await PJ.procurarCnpj()){
            ok = false;
            msg = 'Já existe um Usuário com este CNPJ!';
        }
        if(ok && await PJ.procurarEmail()){
            ok = false;
            msg = 'Já existe um Usuário com este Email!';
        }
        if(ok){
            let result = await PJ.cadastrar();
    
            if(result){
                ok = true;
                msg = 'Pessoa Jurídica cadastrada com Sucesso!';
            }else{
                ok = false;
                msg = 'Erro ao cadastrar Pessoa Jurídica!';
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
        const email = req.body.email;
        const senha = req.body.senha;
        const endereco = req.body.endereco;
        const cnpj = req.body.cnpj;

        let pessoa = new PJModel(id,nome,telefone,email,senha,endereco,cnpj);
        // varificação email cnpj
        if(await pessoa.procurarCnpj() && await pessoa.procurarCnpj() != id){ // verifica se ja existe esse cnpj cadastrado más deixa passar 
            ok = false;                                                     // caso seja da pessoa alterando agora
            msg = 'Já existe um Cliente com Este CNPJ!';
        }
        if(ok == true && await pessoa.procurarEmail() && await pessoa.procurarEmail() != id){// retorna o id do usuario com o email
            ok = false;                                                     //caso o email ja esta cadastrado ele verifica se é da pessoa
            msg = 'Já existe um Cliente com Este Email!';                   //alterando agora e passa
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

    async buscarFornecedorNome(req,res){
        let nome = '%'+req.body.nome+'%';
        let pessoa = new PJModel(null,nome);

        let lista = await pessoa.buscarFornecedorNome();
        
        res.send({lista});
    }
}
module.exports = PJController;