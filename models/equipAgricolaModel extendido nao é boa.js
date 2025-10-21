const produtoModel = require('../models/produtoModel');
const database = require('../utils/database');

class equipAgricolaModel extends produtoModel{
    #marca;
    #marca_nome;

    // #id;
    // #tipo;
    // #nome;
    // #preco;
    // #descricao;
    // #categoria;
    // #categoria_nome;
    constructor(id,nome,preco,descricao, categoria, categoria_nome,marca, marca_nome){
        super(id,null,nome,preco,descricao,categoria,categoria_nome)
        this.#marca = marca;
        this.#marca_nome = marca_nome;
    }
}

let equip = new equipAgricolaModel();
