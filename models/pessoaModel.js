const Database = require("../utils/database");

class pessoaModel{
    #id;
    #nome;
    #telefone;
    #tipo;
    #email;
    #senha;

    set id(valor){ this.#id = valor}
    get id(){return this.#id}
    set nome(valor){ this.#nome = valor}
    get nome(){return this.#nome}
    set telefone(valor){ this.#telefone = valor}
    get telefone(){return this.#telefone}
    set tipo(valor){ this.#tipo = valor}
    get tipo(){return this.#tipo}
    set email(valor){ this.#email = valor}
    get email(){return this.#email}
    set senha(valor){ this.#senha = valor}
    get senha(){return this.#senha}

    constructor(id,nome,telefone,tipo,email,senha){
        this.#id = id;
        this.#nome = nome;
        this.#telefone = telefone;
        this.#tipo = tipo;
        this.#email = email;
        this.#senha = senha;
    }

    async excluir(){
        let sql = 'delete from tb_Pessoa where pessoa_id = ?';
        let valores = [this.#id];
        const banco = new Database();
        let result = await banco.ExecutaComandoNonQuery(sql,valores);
        
        return result;
    }
    async procurarEmail(){
        let sql = 'select pessoa_id from tb_Pessoa where pessoa_email = ?;';
        let valores = [this.email];
        const banco = new Database();
        let result = await banco.ExecutaComando(sql,valores);

        // let pf = new PFisicaModel(result['0']['PF_email']);
        if(result.length > 0){
            let id = result['0']['pessoa_id'];
            return id;
        }
        else
            return false;
    }
    async buscarCliente(){
        let sql = 'select * from tb_Pessoa where pessoa_nome like ?;';
        let valores = [this.nome];
        const banco = new Database();

        let rows = await banco.ExecutaComando(sql,valores);
        
        let lista = [];
        for(let i=0;i<rows.length;i++){
            lista.push(new pessoaModel(rows[i]['pessoa_id'],rows[i]['pessoa_nome']));
        }
        return lista;
    }

    toJSON(){
        return{
            id : this.#id,
            nome : this.#nome
        }
    }
}
module.exports = pessoaModel;