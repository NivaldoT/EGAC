const marcaModel = require('../models/marcaModel');
const categoriaModel = require('../models/categoriaModel');
const produtoModel = require('../models/produtoModel');
const equipAgricolaModel = require ('../models/equipAgricolaModel');
const ServicoModel = require ('../models/servicoModel');

const PFModel = require('../models/pfisicaModel');
const PJModel = require('../models/pjuridicaModel');
//const FuncionarioModel = require('../models/funcionarioModel');
const pessoaModel = require('../models/pessoaModel');

class adminController {

    homeView(req, res) {
        res.render('admin/adminHome',{layout: 'layout_admin'});
    }
    loginView(req, res) {
        res.render('admin/adminLogin',{layout: 'layout_admin'});
    }
    cadastroView(req, res) {
        res.render('admin/adminCadastro',{layout: 'layout_admin'});
    }
    async listarItemView(req,res){
        let tipoListar = req.params.tipo;

        let listaMarcas = [];
        let marca = new marcaModel();
        listaMarcas = await marca.listar();
        
        let listaCategorias = [];
        let categoria = new categoriaModel();
        listaCategorias = await categoria.listar();

        let listaProdutos = [];
        let listaInsumos = [];
        let produto = new produtoModel();
        listaProdutos = await produto.listarProd();
        listaInsumos = await produto.listarInsumo();

        let listaEqAg = [];
        let eqag = new equipAgricolaModel();
        listaEqAg = await eqag.listar();
        
        let listaServicos = [];
        let Servicos = new ServicoModel();
        listaServicos = await Servicos.listar();

    res.render('admin/listagem',{listaMarcas: listaMarcas, listaProdutos: listaProdutos,listaInsumos: listaInsumos, listaEqAg: listaEqAg, listaCategorias: listaCategorias, listaServicos: listaServicos,tipoListar: tipoListar, layout: 'layout_admin'});
    }
    async alterarItemView(req,res){

        let id = req.params.id;
        let tipo = req.params.tipo;

        let prod;
        if(tipo == 1 || tipo == 2){
            prod = new produtoModel();
            prod = await prod.buscarId(id)
        }
        if(tipo == 3){
            prod = new ServicoModel();
            prod = await prod.buscarId(id)
        }
        if(tipo == 4){
            prod = new equipAgricolaModel();
            prod = await prod.buscarId(id)
        }

        if(tipo == 5){
            prod = new marcaModel();
            prod = await prod.buscarId(id);
        }
        
        if(tipo == 6){
            prod = new categoriaModel();
            prod = await prod.buscarId(id);
        }
        
        let listaMarcas = [];
        let marca = new marcaModel();
        listaMarcas = await marca.listar();
        
        let listaCategorias = [];
        let categoria = new categoriaModel();
        listaCategorias = await categoria.listar();
    res.render('admin/alterarItem', {prod: prod, tipo: tipo,listaMarcas: listaMarcas, listaCategorias: listaCategorias, layout: 'layout_admin'});
    }
    async excluirItem(req,res){
        let tipo = req.body.obj.tipo;
        let id = req.body.obj.id;

        let prod;
        if(tipo == 1 || tipo == 2){
            prod = new produtoModel();
            let result = await prod.excluir(id);
            if(result)
                res.send({ok: true , msg: 'Produto Excluido com Sucesso!'});
            else
                res.send({ok: false, msg: 'Falha na Exclusão do Produto!'});
        }
        if(tipo == 3){
            prod = new ServicoModel();
            let result = await prod.excluir(id);
            if(result)
                res.send({ok: true , msg: 'Serviço Excluido com Sucesso!'});
            else
                res.send({ok: false, msg: 'Falha na Exclusão do Serviço!'});
        }
        if(tipo == 4){
            prod = new equipAgricolaModel();
            let result = await prod.excluir(id);
            if(result)
                res.send({ok: true , msg: 'Equipamento Agrícola Excluido com Sucesso!'});
            else
                res.send({ok: false, msg: 'Falha na Exclusão do Equipamento Agrícola!'});
        }
        if(tipo == 5){
            prod = new marcaModel();
            let result = await prod.excluir(id);
            if(result)
                res.send({ok: true , msg: 'Marca Excluida com Sucesso!'});
            else
                res.send({ok: false, msg: 'Falha na Exclusão do Marca!'});
        }
        
        if(tipo == 6){
            let categoria = new categoriaModel(id, null);
            
            // Verificar se há produtos vinculados
            const temProdutos = await categoria.verificarProdutos();
            console.log(`Categoria ID ${id}: ${temProdutos} produtos vinculados`);
            if(temProdutos > 0){
                res.send({ok: false, msg: `Não é possível excluir esta categoria! Existem ${temProdutos} produto(s) vinculado(s) a ela.`});
                return;
            }

            // Verificar se há equipamentos vinculados
            const temEquipamentos = await categoria.verificarEquipamentos();
            console.log(`Categoria ID ${id}: ${temEquipamentos} equipamentos vinculados`);
            if(temEquipamentos > 0){
                res.send({ok: false, msg: `Não é possível excluir esta categoria! Existem ${temEquipamentos} equipamento(s) agrícola(s) vinculado(s) a ela.`});
                return;
            }
            
            let result = await categoria.excluir(id);
            if(result)
                res.send({ok: true , msg: 'Categoria Excluida com Sucesso!'});
            else
                res.send({ok: false, msg: 'Falha na Exclusão da Categoria!'});
        }
    }

    async clientesView(req,res){
        const tipo = req.params.tipo || 'pf'; // pf, pj ou funcionarios
        
        let listaPF = [];
        let pf = new PFModel();
        listaPF = await pf.listar();
        
        let listaPJ = [];
        let pj = new PJModel();
        listaPJ = await pj.listar();
        
        res.render('admin/adminClientes',{layout: 'layout_admin', listaPF: listaPF, listaPJ: listaPJ, tipoSelecionado: tipo});
    }
    PFCadastroView(req,res){
        res.render('admin/PFCadastro',{layout: 'layout_admin'});
    }
    PJCadastroView(req,res){
        res.render('admin/PJCadastro',{layout: 'layout_admin'});
    }
    FuncionarioCadastroView(req,res){
        res.render('admin/FuncionarioCadastro',{layout: 'layout_admin'});
    }

    async excluirCliente(req,res){
        let ok;
        let msg; 
        let id = req.body.obj.id;
        let pessoa = new pessoaModel(id);
        let result = await pessoa.excluir();
        if(result){
            ok = true;
            msg = 'Exclusão concluída com Sucesso!';
        }
        else{
            ok = false;
            msg = 'Falha na Exclusão do Cliente!';
        }
        res.send({ok,msg});
    }

    async alterarClienteView(req,res){
        let id = req.params.id;
        let tipo = req.params.tipo;

        let cliente;
        if(tipo == 1){
            cliente = new PFModel(id);
            cliente = await cliente.buscarId();
        }
        if(tipo == 2){
            cliente = new PJModel(id);
            cliente = await cliente.buscarId();
        }
    res.render('admin/alterarCliente', {layout: 'layout_admin', cliente: cliente});
    }
}

module.exports = adminController;