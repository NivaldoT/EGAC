const CaixaModel = require("../models/caixaModel");
const ContaPagarModel = require("../models/contaPagarModel");
const ContaReceberModel = require("../models/contaReceberModel");
const MovimentoModel = require("../models/movimentoModel");
const PFisicaModel = require("../models/pfisicaModel");

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

        let func = new PFisicaModel(null,null,null,req.cookies.FuncionarioEmail,req.cookies.FuncionarioSenha); // funcionario logado
        func = await func.logarEmailSenha();

        let caixa = new CaixaModel(null,null,null,null,null,func.id,null);
        if(await caixa.buscarCaixaFunc()){  //VERIFICA SE O FUNCIONARIO TEM UM CAIXA ABERTO

            let contaRE = new ContaReceberModel(idConta);
            contaRE = await contaRE.buscarId();
            if(await contaRE.receber()){  //RECEBE A CONTA NO BANCO DE DADOS

                let movimento = new MovimentoModel(null, 2, null, contaRE.id, contaRE.valor, caixa.id, new Date());
                if(await movimento.gravar()){ // GRAVA O MOVIMENTO NO BANCO DE DADOS

                    if(await caixa.atualizarSaldo(contaRE.valor)){ // FINALMENTE ATUALIZA SALDO CAIXA
                        msg = 'Conta Recebida com Sucesso!';

                    }else{ok = false; msg = 'Falha ao Atualizar Saldo do Caixa!'}

                }else{ok = false; msg = 'Falha ao Gravar Movimento!'};

            }else{ok = false; msg = 'Erro ao Receber Conta!'};
        }
        else{ok = false; msg = 'O Caixa está fechado!'};

        res.send({ok,msg});   
    }
    async pagar(req,res){
        let ok;
        let msg;
        let idConta = req.body.id;

        let func = new PFisicaModel(null,null,null,req.cookies.FuncionarioEmail,req.cookies.FuncionarioSenha); // funcionario logado
        func = await func.logarEmailSenha();

        let caixa = new CaixaModel(null,null,null,null,null,func.id,null);
        if(await caixa.buscarCaixaFunc()){ // VÊ SE O FUNCIONARIO TEM UM CAIXA ABERTO

            let contaPG = new ContaPagarModel(idConta);
            contaPG = await contaPG.buscarId();
            if(caixa.valor > contaPG.valor){ //COMPARA SE TEM DINHEIRO NO CAIXA PARA PAGAR
                
                if(await contaPG.pagar()){ //PAGA NO BANCO DE DADOS
    
                    let movimento = new MovimentoModel(null,1,contaPG.id,null,contaPG.valor,caixa.id,new Date());
                    if(await movimento.gravar()){ //GRAVA O MOVIMENTO NO BANCO DE DADOS
    
                        if(await caixa.atualizarSaldo(-contaPG.valor)){ //ATUALIZA O SALDO DO CAIXA
                            msg = 'Conta Paga com Sucesso!';
                        }
                    }else{ok = false; msg = 'Erro ao Gravar Movimento Banco de Dados!'};
    
                }else{ok = false; msg = 'Erro ao Pagar Conta Banco de Dados!'};
            }
        }
        else{ok = false; msg = 'O caixa está fechado!'};
        
        res.send({ok,msg});   
    }
}
module.exports = ContasController;