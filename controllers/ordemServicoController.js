const itensUsadosOSModel = require("../models/itensUsadosOSModel");
const OrdemDeServicoModel = require("../models/ordemServicoModel");
const produtoModel = require("../models/produtoModel");
const ServicoModel = require("../models/servicoModel");
const subItemModel = require("../models/subItemModel");

class OrdemDeServicoController{
    async homeView(req,res){
        let os = new OrdemDeServicoModel();
        let listaOS = [];
        listaOS = await os.listar();

        res.render('admin/ordemServico/home.ejs',{listaOS: listaOS,layout: 'layout_admin'});
    }

    async abrirView(req,res){
        let listaServicos = [];
        let Servicos = new ServicoModel();
        listaServicos = await Servicos.listar();

        res.render('admin/ordemServico/abrir.ejs',{listaServicos: listaServicos ,layout: 'layout_admin'});
    }
    async concluirView(req,res){
        let id = req.params.id;
        let os = new OrdemDeServicoModel(id);
        os = await os.buscarId();
        res.render('admin/ordemServico/concluir.ejs',{os: os,layout: 'layout_admin'});
    }
    async receberView(req,res){
        let id = req.params.id;
        let os = new OrdemDeServicoModel(id);
        os = await os.buscarId();
        res.render('admin/ordemServico/receber.ejs',{os: os,layout: 'layout_admin'});
    }
    async abrirOS(req,res){
        console.log(req.body)
        let pessoa = req.body.pessoa;
        let EqAg = req.body.EqAg;
        let servico = req.body.servico;
        let func = req.body.func;
        let comentario = req.body.comentario;

        let ok;
        let msg;

        let OS = new OrdemDeServicoModel(null,pessoa,servico,EqAg,func,null,null,null,comentario);
        let result = await OS.abrirOS();
        if(result){
            ok = true;
            msg = 'Ordem de Serviço Aberta com sucesso!';
        }else{
            ok = false;
            msg = 'Falha ao abrir Ordem de Serviço!';
        }
        res.send({ok,msg});
    }
    async concluirOS(req,res){
        let ok;
        let msg;
        let idOS = req.body.idOS;
        let listaInsumo = req.body.listaInsumo;
        let listaSubItem = req.body.listaSubItem;
        let comentario = req.body.comentario;
        console.log(idOS,listaInsumo,listaSubItem,comentario)

        let os = new OrdemDeServicoModel(idOS,null,null,null,null,null,null,null,comentario);
        let result = await os.concluirOS(); 
        if(result){
            ok = true;
            let subItem;
            for(let i=0;i<listaSubItem.length;i++){
                subItem = new subItemModel(null,idOS,listaSubItem[i].idFunc,null,listaSubItem[i].nome);
                let result = await subItem.gravar();
                if(!result){i=listaSubItem.length; ok = false};
            }
            let itUsadoOS;
            for(let i=0;i<listaInsumo.length;i++){
                let insumo = new produtoModel();
                insumo = await insumo.buscarId(listaInsumo[i].idProd);
                itUsadoOS = new itensUsadosOSModel(null,idOS,listaInsumo[i].idProd,null,listaInsumo[i].qtd,insumo.preco);
                let result = await itUsadoOS.gravar();
                if(result){
                    ok = await insumo.atualizarEstoque(-(listaInsumo[i].qtd));
                    if(!ok){msg = 'Erro ao Atualizar Estoque do item '+insumo.nome; i = listaInsumo.length};
                }
                else{i = listaInsumo.length; ok = false};
            }
            if(ok){msg = 'Ordem de Serviço cadastrada com Sucesso!'};
        }
        else{
            ok = false;
            msg = 'Erro ao concluir Ordem de Serviço!';
        }

        res.send({ok,msg})
    }
}
module.exports = OrdemDeServicoController;