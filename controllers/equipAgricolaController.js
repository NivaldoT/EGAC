const equipAgricolaModel = require ('../models/equipAgricolaModel');
const marcaModel = require ('../models/marcaModel');
class equipAgricolasController{

    // TIPO 1 = PRODUTO
    // TIPO 2 = INSUMO
    // TIPO 3 = EQUIPAMENTO AGRICOLA   // FAZER NOVA TABELA COM FK COM OS NOMES
    // TIPO 4 = MARCA
    // TIPO 5 = SERVIÇO

    async cadastrarView(req,res){
        let listaMarcas = [];
        let marca = new marcaModel();
        listaMarcas = await marca.listar();

        res.render('admin/cadastrarEqAgricola',{listaMarcas: listaMarcas, layout: 'layout2'});
    }
    async cadastrar(req,res){
        const nome = req.body.nome;
        const preco = req.body.preco;
        const marca = req.body.marca;

        let prod = new equipAgricolaModel(null,nome,preco,marca);
        
        let result = await prod.cadastrar();
        if(result)
            res.send({ok: true, msg: 'Equipamento Agricola cadastrado com Sucesso!'});
        else
            res.send({ok:false, msg: 'Erro ao cadastrar Equipamento Agricola!'});
    }
    async alterar(req,res){
        const id = req.body.id;
        const nome = req.body.nome;
        const preco = req.body.preco;
        const marca = req.body.marca;

        let equip = new equipAgricolaModel(id,nome,preco,marca);
        
        let result = await equip.alterar();
        if(result)
            res.send({ok: true, msg: 'Equipamento Agrícola alterado com Sucesso!'});
        else
            res.send({ok:false, msg: 'Erro ao alterar Equipamento Agrícola!'});
    }

    
}
module.exports = equipAgricolasController;