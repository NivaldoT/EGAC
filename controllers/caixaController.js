const CaixaModel = require("../models/caixaModel");
const PFisicaModel = require("../models/pfisicaModel");

class CaixaController{
    async getStatus(req,res){
        let status;
        let valor;

        let caixa = new CaixaModel()
        if(await caixa.getCaixa()){
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
        let valor = req.body.valor;
        let func = new PFisicaModel(null,null,null,req.cookies.FuncionarioEmail,req.cookies.FuncionarioSenha);
        func = await func.logarEmailSenha();

        let caixa = new CaixaModel(null,valor,null,null,null,func.id);
        if(await caixa.abrir()){
            ok = true;
        }else{ok = false;}

        res.send({ok});
    }
}
module.exports = CaixaController;