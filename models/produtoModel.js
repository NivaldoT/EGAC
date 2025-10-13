const Database = require("../utils/database");

class produtoModel{
    #id;
    #tipo;
    #nome;
    #preco;
    #descricao;
    #categoria;
    #categoria_nome;

    set id(valor){this.#id = valor};
    get id(){return this.#id};
    set tipo(valor){this.#tipo = valor};
    get tipo(){return this.#tipo};
    set nome(valor){this.#nome = valor};
    get nome(){return this.#nome};
    set preco(valor){this.#preco = valor};
    get preco(){return this.#preco};
    set descricao(valor){this.#descricao = valor};
    get descricao(){return this.#descricao};
    set categoria(valor){this.#categoria = valor};
    get categoria(){return this.#categoria};
    set categoria_nome(valor){this.#categoria_nome = valor};
    get categoria_nome(){return this.#categoria_nome};

    constructor(id,tipo,nome,preco,descricao, categoria, categoria_nome){
        this.#id = id;
        this.#tipo = tipo;
        this.#nome = nome;
        this.#preco = preco;
        this.#descricao = descricao;
        this.#categoria = categoria;
        this.#categoria_nome = categoria_nome;
    }

    async cadastrar(){
        const sql = 'insert into tb_Produto(prod_nome,prod_tipo,prod_preco,prod_descricao, prod_categoria) values(?,?,?,?,?)';
        const valores = [this.#nome, this.#tipo, this.#preco, this.#descricao, this.#categoria];
        const banco = new Database();

        let result = await banco.ExecutaComandoNonQuery(sql,valores);
        return result;
    }

    async listar(){
        const sql ='select * from tb_Produto p inner join tb_Categoria c on p.prod_categoria = c.categoria_id';
        const banco = new Database();
        const rows = await banco.ExecutaComando(sql);
        
        let lista = [];
        for(let i=0; i<rows.length;i++){
            lista.push(new produtoModel(rows[i]['prod_id'],rows[i]['prod_tipo'], rows[i]['prod_nome'], rows[i]['prod_preco'], rows[i]['prod_descricao'], rows[i]['prod_categoria'], rows[i]['categoria_nome']));
        }

        return lista;
    }

    async buscarId(id){
        const sql ='select * from tb_Produto where prod_id = ?';
        const valores = [id];
        const banco = new Database();
        
        const row = await banco.ExecutaComando(sql,valores);
        let prod = new produtoModel(row['0']['prod_id'], row['0']['prod_tipo'], row['0']['prod_nome'], row['0']['prod_preco'], row['0']['prod_descricao'], row['0']['prod_categoria']);
        return prod;
    }

    async alterar(){
        const sql = 'update tb_Produto set prod_nome = ?, prod_tipo = ?, prod_preco = ?, prod_descricao = ?, prod_categoria = ? where prod_id = ?';
        const valores = [this.#nome,this.#tipo,this.#preco,this.#descricao,this.#categoria, this.#id];
        const banco = new Database();

        let result = await banco.ExecutaComandoNonQuery(sql,valores);
        return result;
    }

    async excluir(id){
        const sql = 'delete from tb_Produto where prod_id = ?';
        const valores = [id];
        const banco = new Database();

        let result = await banco.ExecutaComandoNonQuery(sql,valores);
        return result;
    }
}

module.exports = produtoModel;