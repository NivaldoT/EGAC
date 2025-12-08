const produtoModel = require ('../models/produtoModel');
const categoriaModel = require ('../models/categoriaModel');
const marcaModel = require('../models/marcaModel');

class produtosController{

    // TIPO 1 = PRODUTO
    // TIPO 2 = INSUMO
    async cadastrarView(req,res){
        let listaCategorias = [];
        let categoria = new categoriaModel();
        listaCategorias = await categoria.listar();

        let listaMarcas = [];
        let marca = new marcaModel();
        listaMarcas = await marca.listar();

        res.render('admin/cadastrarProd',{listaCategorias: listaCategorias,listaMarcas: listaMarcas, layout: 'layout_admin'});
    }
    async cadastrar(req,res){
        const tipoItem = req.body.tipoItem;
        const nome = req.body.nome;
        const preco = req.body.preco;
        const estoque = req.body.estoque || 0;
        const descricao = req.body.descricao;
        const categoria = req.body.categoria;
        const marca = req.body.marca;
        const imagem = req.file ? req.file.filename : null;

        // Validação de campos obrigatórios
        if(!tipoItem || !nome || !preco || estoque === '' || !descricao || !categoria || !marca || !imagem) {
            return res.send({ok: false, msg: 'Todos os campos são obrigatórios!'});
        }

        // Validação de estoque negativo
        if(parseFloat(estoque) < 0) {
            return res.send({ok: false, msg: 'Estoque não pode ser negativo!'});
        }

        let prod = new produtoModel(null,tipoItem,nome,preco,descricao,categoria,null,marca,null,estoque,imagem);
        
        let result = await prod.cadastrar();
        if(result)
            res.send({ok: true, msg: 'Produto cadastrado com Sucesso!'});
        else
            res.send({ok:false, msg: 'Erro ao cadastrar produto!'});
    }
    async alterar(req,res){
        const id = req.body.id;
        const tipoItem = req.body.tipoItem;
        const nome = req.body.nome;
        const preco = req.body.preco;
        const descricao = req.body.descricao;
        const categoria = parseInt(req.body.categoria) || null;
        let marca = parseInt(req.body.marca) || null;
        
        // Se marca for 0, transformar em null
        if(marca === 0) marca = null;
        
        console.log('Dados recebidos:', { id, tipoItem, nome, preco, descricao, categoria, marca });
        
        // Buscar produto atual com busca id para pegar imagem antiga
        let produtoAtual = new produtoModel();
        produtoAtual = await produtoAtual.buscarId(id);
        
        // Se veio nova imagem, usar a nova, senão manter a antiga
        let imagem = req.file ? req.file.filename : produtoAtual.imagem;
        
        // Se veio nova imagem, deletar a antiga
        if(req.file && produtoAtual.imagem) {
            const fs = require('fs');
            const caminhoImagemAntiga = global.CAMINHO_IMG_PRODUTOS_ABS + produtoAtual.imagem;
            if(fs.existsSync(caminhoImagemAntiga)) {
                fs.unlinkSync(caminhoImagemAntiga);
            }
        }

        let prod = new produtoModel(id,tipoItem,nome,preco,descricao,categoria,null,marca,null,null,imagem);
        
        let result = await prod.alterar();
        if(result)
            res.send({ok: true, msg: 'Produto alterado com Sucesso!'});
        else
            res.send({ok:false, msg: 'Erro ao alterar produto!'});
    }

    async atualizarEstoque(req, res){
        let id = req.body.id;
        let quantidade = req.body.quantidade;

        let produto = new produtoModel();
        produto = await produto.buscarId(id);

        let estoqueAtual = produto.estoque;
        let novoEstoque = estoqueAtual + quantidade;

        if(novoEstoque < 0){
            res.send({ok: false, msg: 'Estoque não pode ficar negativo!'});
            return;
        }

        let prod = new produtoModel();
        prod.id = id;
        let result = await prod.atualizarEstoque(quantidade);

        if(result){
            res.send({ok: true, msg: 'Estoque atualizado!', estoque: novoEstoque});
        }
        else{
            res.send({ok: false, msg: 'Erro ao atualizar estoque!'});
        }
    }


    async buscarProdutoNome(req,res){
        let nome = '%'+req.body.nome+'%';
        let Produto = new produtoModel(null,null,nome);

        let lista = await Produto.buscarProdutoNome();
        
        res.send({lista});
    }
    async buscarInsumoNome(req,res){
        let nome = '%'+req.body.nome+'%';
        let insumo = new produtoModel(null,null,nome);

        let lista = await insumo.buscarInsumoNome();
        
        res.send({lista});
    }

    async buscarId(req,res){
        let id = req.body.id;
        let prod = new produtoModel();
        prod = await prod.buscarId(id);
        res.send({prod});
    }
}
module.exports = produtosController;