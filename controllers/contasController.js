const CaixaModel = require("../models/caixaModel");
const ContaPagarModel = require("../models/contaPagarModel");
const ContaReceberModel = require("../models/contaReceberModel");
const MovimentoModel = require("../models/movimentoModel");

class ContasController{
    async contasView(req,res){

        res.render('admin/contas/home.ejs',{layout: 'layout_admin'});
    }

    async listar(req, res) {
        let termo = null;
        if(req.query.termo) {
            termo = req.query.termo;
        }
        let tipoBusca = req.query.tipoBusca;

        let lista = [];
        if(tipoBusca == 1){
            let contaPG = new ContaPagarModel();
            lista = await contaPG.listar(termo);
        }
        if(tipoBusca == 2){
            let contaRE = new ContaReceberModel();
            lista = await contaRE.listar(termo);
        }


        // let itemVenda = new conta();
        // let lista = await itemVenda.listar(termo);
        res.send({lista});
    }

    async receber(req,res){
        let ok;
        let msg;
        let idConta = req.body.id;
        
        let caixa = new CaixaModel();
        if(await caixa.getCaixa()){
            let contaRE = new ContaReceberModel(idConta);
            contaRE = await contaRE.buscarId();
            ok = await contaRE.receber();
            if(ok){
                let movimento = new MovimentoModel(null, 2, null, contaRE.id, contaRE.valor, caixa.id, new Date());
                ok = await movimento.gravar();
                if(ok){
                    ok = await caixa.atualizarSaldo(contaRE.valor);
                    if(ok){
                        msg = 'Conta Recebida com Sucesso!';
                    }else{ok = false; msg = 'Falha ao Atualizar Caixa!'}
                }else{ok = false; msg = 'Falha ao Gerar Movimento!'};
            }
            else{msg = 'Erro ao Receber Conta!'};
        }
        else{ok = false; msg = 'O Caixa está fechado!'};

        res.send({ok,msg});   
    }
    async pagar(req,res){
        let ok;
        let msg;
        res.send({ok,msg});   
    }
}
module.exports = ContasController;