const Database = require("../utils/database");

class categoriaModel{
    #id;
    #nome;

    set id(valor){this.#id = valor};
    get id(){return this.#id};
    set nome(valor){this.#nome = valor};
    get nome(){return this.#nome};

    constructor(id,nome){
        this.#id = id;
        this.#nome = nome;
    }
    async cadastrar(){
        const sql = 'insert into tb_Categoria(categoria_nome) values(?)';
        const valores = [this.#nome];
        const banco = new Database();

        let result = await banco.ExecutaComandoNonQuery(sql,valores);
        return result;
    }

    async listar(){
        const sql ='select * from tb_Categoria';
        const banco = new Database();
        const rows = await banco.ExecutaComando(sql);
        
        let lista = [];
        for(let i=0; i<rows.length;i++){
            lista.push(new categoriaModel(rows[i]['categoria_id'], rows[i]['categoria_nome'] ));
        }

        return lista;
    }

    async buscarId(id){
        const sql ='select * from tb_Categoria where categoria_Id = ?';
        const valores = [id];
        const banco = new Database();
        
        const result = await banco.ExecutaComando(sql,valores);
        let categoria = new categoriaModel(result['0']['categoria_id'], result['0']['categoria_nome']);
        return categoria;
    }

    async alterar(){
        const sql = 'update tb_Categoria set categoria_nome = ? where categoria_id = ?';
        const valores = [this.#nome, this.#id];
        const banco = new Database();

        let result = await banco.ExecutaComandoNonQuery(sql,valores);
        return result;
    }

    async verificarProdutos(){
        let sql = 'select count(*) as total from tb_Produto where prod_categoria = ?';
        let valores = [this.#id];
        let banco = new Database();
        let result = await banco.ExecutaComando(sql, valores);
        return result[0].total;
    }

    async verificarEquipamentos(){
        let sql = 'select count(*) as total from tb_EquipamentoAgricola where eq_categoria = ?';
        let valores = [this.#id];
        let banco = new Database();
        let result = await banco.ExecutaComando(sql, valores);
        return result[0].total;
    }

    async excluir(id){
        const sql = 'delete from tb_Categoria where categoria_id = ?';
        const valores = [id];
        const banco = new Database();

        let result = await banco.ExecutaComandoNonQuery(sql,valores);
        return result;
    }
}

module.exports = categoriaModel;