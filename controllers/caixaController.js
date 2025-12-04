const CaixaModel = require("../models/caixaModel");
const PFisicaModel = require("../models/pfisicaModel");

class CaixaController{

    caixaView(req,res){
        res.render('admin/caixa/index', {layout: 'layout_admin'})
    }

    async getStatus(req,res){
        
        let func = new PFisicaModel(null,null,null,req.cookies.UsuarioEmail,req.cookies.UsuarioSenha);
        func = await func.logarEmailSenha();
        let caixa = new CaixaModel(null,null,0,null,null,func.id)
        await caixa.buscarCaixaFunc() // VERIFICA SE O FUNCIONARIO TEM UM CAIXA ABERTO
        
        res.send({caixa});
    }

    async abrir(req,res){
        let ok;
        let msg;
        let valor = req.body.valor;
        let func = new PFisicaModel(null,null,null,req.cookies.UsuarioEmail,req.cookies.UsuarioSenha);
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
        let msg;

        let idCaixa = req.body.idCaixa;

        let caixa = new CaixaModel(idCaixa);
        if(await caixa.fechar()){
            ok = true;
            msg = 'Caixa fechado com sucesso!';
        }else{ok = false; msg = 'Erro ao Fechar Caixa!'};
        res.send({ok,msg});
    }
}

module.exports = CaixaController;