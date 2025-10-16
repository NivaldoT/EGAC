const servicoModel = require ('../models/servicoModel');
class servicoController{

    // TIPO 1 = servico
    // TIPO 2 = INSUMO
    // TIPO 3 = SERVIÇO
    // TIPO 4 = EQUIPAMENTO AGRICOLA
    // TIPO 5 = MARCA

    async cadastrarView(req,res){

        res.render('admin/cadastrarServico',{layout: 'layout2'});
    }

    async cadastrar(req,res){
        const nome = req.body.nome;
        const preco = req.body.preco;
        const descricao = req.body.descricao;

        let serv = new servicoModel(null,nome,preco,descricao);
        
        let result = await serv.cadastrar();
        if(result)
            res.send({ok: true, msg: 'Serviço cadastrado com Sucesso!'});
        else
            res.send({ok: false, msg: 'Erro ao cadastrar Serviço!'});
    }
    async alterar(req,res){
        const id = req.body.id;
        const nome = req.body.nome;
        const preco = req.body.preco;
        const descricao = req.body.descricao;

        let serv = new servicoModel(id,nome,preco,descricao);
        
        let result = await serv.alterar();
        if(result)
            res.send({ok: true, msg: 'Serviço alterado com Sucesso!'});
        else
            res.send({ok: false, msg: 'Erro ao alterar Serviço!'});
    }

    
}
module.exports = servicoController;