const CaixaModel = require("../models/caixaModel");
const PFisicaModel = require("../models/pfisicaModel");

class CaixaController{

    caixaView(req,res){
        res.render('admin/caixa/index', {layout: 'layout_admin'})
    }

    async getStatus(req,res){
        let status;
        let valor;

        let func = new PFisicaModel(null,null,null,req.cookies.FuncionarioEmail,req.cookies.FuncionarioSenha);
        func = await func.logarEmailSenha();
        let caixa = new CaixaModel(null,null,null,null,null,func.id)
        if(await caixa.buscarCaixaFunc()){ // VERIFICA SE O FUNCIONARIO TEM UM CAIXA ABERTO
            status = caixa.status;
            valor = caixa.valor;
        }
        else{
            status = 0;
        }
        res.send({status,valor});
    }

    async abrir(req,res){
        let ok;
        let msg;
        let valor = req.body.valor;
        let func = new PFisicaModel(null,null,null,req.cookies.FuncionarioEmail,req.cookies.FuncionarioSenha);
        func = await func.logarEmailSenha();

        let caixa = new CaixaModel(null,valor,null,null,null,func.id);
        if(!(await caixa.buscarCaixaFunc())){ // VERIFICA SE TEM ALGUM CAIXA ABERTO DESSE FUNCIONÁRIO
            if(await caixa.abrir()){
                ok = true;
                msg = 'Caixa aberto com Sucesso!';
            }
            else{
                ok = false;
                msg = 'Erro ao abrir caixa!';
            }
        }
        else{
            ok = false;
            msg = 'Funcionário '+func.nome+' já tem um caixa aberto! Caixa-ID = '+caixa.id;
        }
        res.send({ok,msg});
    }

    async fechar(req,res){
        let ok;
        let valorFinal = req.body.valorFinal;
        let obs = req.body.obs || '';
        let func = new PFisicaModel(null,null,null,req.cookies.FuncionarioEmail,req.cookies.FuncionarioSenha);
        func = await func.logarEmailSenha();

        let caixa = new CaixaModel();
        if(await caixa.fecharCaixa(valorFinal, func.id, obs)){
            ok = true;
        }else{ok = false;}
        res.send({ok});
    }
}

module.exports = CaixaController;