const equipAgricolaModel = require ('../models/equipAgricolaModel');
const marcaModel = require ('../models/marcaModel');
const categoriaModel = require('../models/categoriaModel')
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

        let listaCategorias = [];
        let categoria = new categoriaModel();
        listaCategorias = await categoria.listar();

        res.render('admin/cadastrarEqAgricola',{listaMarcas: listaMarcas,listaCategorias: listaCategorias, layout: 'layout2'});
    }
    async cadastrar(req,res){
        const nome = req.body.nome;
        const preco = req.body.preco;
        const marca = req.body.marca;
        const descricao = req.body.descricao;
        const categoria = req.body.categoria;


        let prod = new equipAgricolaModel(null,nome,preco,marca,null,descricao,categoria,null);
        
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
        const descricao = req.body.descricao;
        const categoria = req.body.categoria;

        let equip = new equipAgricolaModel(id,nome,preco,marca,null,descricao,categoria,null);
        
        let result = await equip.alterar();
        if(result)
            res.send({ok: true, msg: 'Equipamento Agrícola alterado com Sucesso!'});
        else
            res.send({ok:false, msg: 'Erro ao alterar Equipamento Agrícola!'});
    }

    
}
module.exports = equipAgricolasController;