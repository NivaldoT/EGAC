const Database = require("../utils/database");

class produtoModel{
    #id;
    #tipo;
    #nome;
    #preco;
    #descricao;
    #categoria;
    #categoria_nome;
    #marca;
    #marca_nome;
    #estoque;
    #imagem;

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
    set marca_nome(valor){this.#marca_nome = valor};
    get marca_nome(){return this.#marca_nome};
    set estoque(valor){this.#estoque = valor};
    get estoque(){return this.#estoque};
    set imagem(valor){this.#imagem = valor};
    get imagem(){return this.#imagem};

    constructor(id,tipo,nome,preco,descricao, categoria, categoria_nome, marca, marca_nome, estoque, imagem){
        this.#id = id;
        this.#tipo = tipo;
        this.#nome = nome;
        this.#preco = preco;
        this.#descricao = descricao;
        this.#categoria = categoria;
        this.#categoria_nome = categoria_nome;
        this.#marca = marca;
        this.#marca_nome = marca_nome;
        this.#estoque = estoque;
        this.#imagem = imagem;
    }

    async cadastrar(){
        const sql = 'insert into tb_Produto(prod_nome,prod_tipo,prod_preco,prod_descricao, prod_categoria, prod_marca, prod_imagem) values(?,?,?,?,?,?,?)';
        const valores = [this.#nome, this.#tipo, this.#preco, this.#descricao, this.#categoria,this.#marca, this.#imagem];
        const banco = new Database();

        let result = await banco.ExecutaComandoNonQuery(sql,valores);
        return result;
    }

    async listar(){
        const sql ='select * from tb_Produto p inner join tb_Categoria c on p.prod_categoria = c.categoria_id inner join tb_Marca m on p.prod_marca = m.marca_id';
        const banco = new Database();
        const rows = await banco.ExecutaComando(sql);
        
        let lista = [];
        for(let i=0; i<rows.length;i++){
            // Formatar caminho da imagem
            const fs = require('fs');
            let imagemPath = "";
            if(rows[i]['prod_imagem'] != null && rows[i]['prod_imagem'] != '' && fs.existsSync(global.CAMINHO_IMG_PRODUTOS_ABS + rows[i]['prod_imagem'])) {
                imagemPath = global.CAMINHO_IMG_PRODUTOS + rows[i]['prod_imagem'];
            } else {
                imagemPath = "/images/produto-sem-imagem.webp"; // imagem padrão
            }
            
            let produto = new produtoModel(rows[i]['prod_id'],rows[i]['prod_tipo'], rows[i]['prod_nome'], rows[i]['prod_preco'], rows[i]['prod_descricao'], rows[i]['prod_categoria'], rows[i]['categoria_nome'], rows[i]['prod_marca'], rows[i]['marca_nome'], rows[i]['prod_estoque'], imagemPath);
            lista.push(produto);
        }

        return lista;
    }
    
    async listarProd(){
        const sql ='select * from tb_Produto p inner join tb_Categoria c on p.prod_categoria = c.categoria_id inner join tb_Marca m on p.prod_marca = m.marca_id where prod_tipo = 1';
        const banco = new Database();
        const rows = await banco.ExecutaComando(sql);
        
        let lista = [];
        for(let i=0; i<rows.length;i++){
            // Formatar caminho da imagem
            const fs = require('fs');
            let imagemPath = "";
            if(rows[i]['prod_imagem'] != null && rows[i]['prod_imagem'] != '' && fs.existsSync(global.CAMINHO_IMG_PRODUTOS_ABS + rows[i]['prod_imagem'])) {
                imagemPath = global.CAMINHO_IMG_PRODUTOS + rows[i]['prod_imagem'];
            } else {
                imagemPath = "/images/produto-sem-imagem.webp"; // imagem padrão
            }
            
            let produto = new produtoModel(rows[i]['prod_id'],rows[i]['prod_tipo'], rows[i]['prod_nome'], rows[i]['prod_preco'], rows[i]['prod_descricao'], rows[i]['prod_categoria'], rows[i]['categoria_nome'], rows[i]['prod_marca'], rows[i]['marca_nome'], rows[i]['prod_estoque'], imagemPath);
            lista.push(produto);
        }

        return lista;
    }

    async listarInsumo(){
        const sql ='select * from tb_Produto p inner join tb_Categoria c on p.prod_categoria = c.categoria_id inner join tb_Marca m on p.prod_marca = m.marca_id where prod_tipo = 2';
        const banco = new Database();
        const rows = await banco.ExecutaComando(sql);
        
        let lista = [];
        for(let i=0; i<rows.length;i++){
            lista.push(new produtoModel(rows[i]['prod_id'],rows[i]['prod_tipo'], rows[i]['prod_nome'], rows[i]['prod_preco'], rows[i]['prod_descricao'], rows[i]['prod_categoria'], rows[i]['categoria_nome'], rows[i]['prod_marca'], rows[i]['marca_nome'], rows[i]['prod_estoque'], rows[i]['prod_imagem']));
        }

        return lista;
    }

    async buscarId(id){
        const sql ='select * from tb_Produto where prod_id = ?';
        const valores = [id];
        const banco = new Database();
        
        const row = await banco.ExecutaComando(sql,valores);
        let prod = new produtoModel(row['0']['prod_id'], row['0']['prod_tipo'], row['0']['prod_nome'], row['0']['prod_preco'], row['0']['prod_descricao'], row['0']['prod_categoria'],null,row['0']['prod_marca'],null,row['0']['prod_estoque'], row['0']['prod_imagem']);
        return prod;
    }

    async alterar(){
        const sql = 'update tb_Produto set prod_nome = ?, prod_tipo = ?, prod_preco = ?, prod_descricao = ?, prod_categoria = ?, prod_marca = ?, prod_imagem = ? where prod_id = ?';
        const valores = [this.#nome,this.#tipo,this.#preco,this.#descricao,this.#categoria,this.#marca, this.#imagem, this.#id];
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

    async buscarProdutoNome(){
        let sql = 'select * from tb_Produto where prod_nome like ?';
        let valores = [this.#nome];
        let banco = new Database();
        let rows = await banco.ExecutaComando(sql,valores);

        let lista = [];
        for(let i=0; i<rows.length;i++){
            lista.push(new produtoModel(rows[i]['prod_id'],null,rows[i]['prod_nome']))
        }
        return lista;
    }
    async buscarInsumoNome(){
        let sql = 'select * from tb_Produto where prod_nome like ? and prod_tipo = 2;';
        let valores = [this.#nome];
        let banco = new Database();
        let rows = await banco.ExecutaComando(sql,valores);

        let lista = [];
        for(let i=0; i<rows.length;i++){
            lista.push(new produtoModel(rows[i]['prod_id'],null,rows[i]['prod_nome']))
        }
        return lista;
    }
    async atualizarEstoque(qtd){
        let sql = 'update tb_Produto set prod_estoque = prod_estoque +(?) where prod_id = ?;';
        let valores = [qtd, this.#id];
        let banco = new Database();
        let result = await banco.ExecutaComandoNonQuery(sql,valores);
        return result;
    }

    toJSON(){
        return{
            id: this.#id,
            nome: this.#nome,
            tipo: this.#tipo,
            preco: this.#preco,
            descricao: this.#descricao,
            categoria: this.#categoria,
            categoria_nome: this.#categoria_nome,
            marca: this.#marca,
            marca_nome: this.#marca_nome,
            estoque: this.#estoque
        }
    }
}

module.exports = produtoModel;