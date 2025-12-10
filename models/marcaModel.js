const Database = require("../utils/database");

class marcaModel{
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
        const sql = 'insert into tb_Marca(marca_nome) values(?)';
        const valores = [this.#nome];
        const banco = new Database();

        let result = await banco.ExecutaComandoNonQuery(sql,valores);
        return result;
    }

    async listar(){
        const sql ='select * from tb_Marca';
        const banco = new Database();
        const rows = await banco.ExecutaComando(sql);
        
        let lista = [];
        for(let i=0; i<rows.length;i++){
            lista.push(new marcaModel(rows[i]['marca_id'], rows[i]['marca_nome'] ));
        }

        return lista;
    }

    async buscarId(id){
        const sql ='select * from tb_Marca where marca_Id = ?';
        const valores = [id];
        const banco = new Database();
        
        const result = await banco.ExecutaComando(sql,valores);
        let marca = new marcaModel(result['0']['marca_id'], result['0']['marca_nome']);
        return marca;
    }

    async alterar(){
        const sql = 'update tb_Marca set marca_nome = ? where marca_id = ?';
        const valores = [this.#nome, this.#id];
        const banco = new Database();

        let result = await banco.ExecutaComandoNonQuery(sql,valores);
        return result;
    }

    async excluir(id){
        const sql = 'delete from tb_Marca where marca_id = ?';
        const valores = [id];
        const banco = new Database();

        let result = await banco.ExecutaComandoNonQuery(sql,valores);
        return result;
    }

    async verificarChild(){
        let sql = `select count(*) as total from tb_Marca m
                    left join tb_Produto p on p.prod_marca = m.marca_id
                    left join tb_EquipamentoAgricola eq on eq.eq_marcaId = m.marca_id where marca_id = ?`
        let valores = [this.#id];
        let banco = new Database();
        let result = await banco.ExecutaComando(sql, valores);
        return result[0].total;
    }
}

module.exports = marcaModel;