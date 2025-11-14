const OrdemDeServicoModel = require("../models/ordemServicoModel");
const ServicoModel = require("../models/servicoModel");

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
}
module.exports = OrdemDeServicoController;