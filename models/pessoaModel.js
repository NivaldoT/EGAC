const Database = require("../utils/database");

class pessoaModel{
    #id;
    #nome;
    #telefone;
    #tipo;
    #email;
    #senha;
    #endereco;

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
    set endereco(valor){ this.#endereco = valor}
    get endereco(){return this.#endereco}

    constructor(id,nome,telefone,tipo,email,senha,endereco){
        this.#id = id;
        this.#nome = nome;
        this.#telefone = telefone;
        this.#tipo = tipo;
        this.#email = email;
        this.#senha = senha;
        this.#endereco = endereco;
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

        if(result.length > 0){
            let id = result['0']['pessoa_id'];
            return id;
        }
        else
            return false;
    }
    async buscarClienteNome(){
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
    async logarEmailSenha(){
        // let sql = 'select * from tb_PFisica pf inner join tb_Pessoa p on pf.PF_id = p.pessoa_id where p.pessoa_email = ? and p.pessoa_senha = ?;'
        let sql = 'select * from tb_Pessoa where pessoa_email = ? and pessoa_senha = ?;'
        let valores = [this.email, this.senha];
        const banco = new Database();
        let result = await banco.ExecutaComando(sql,valores);

        if(result.length>0){
            let pessoa = new pessoaModel(result['0']['pessoa_id'],result['0']['pessoa_nome'],result['0']['pessoa_telefone'],result['0']['pessoa_tipo'], result['0']['pessoa_email'],result['0']['pessoa_senha']);
            return pessoa;
        }
        else
            return null;
    }

    async buscarPorEmail(email){
        let sql = 'select * from tb_Pessoa where pessoa_email = ?;'
        let valores = [email || this.email];
        const banco = new Database();
        let result = await banco.ExecutaComando(sql,valores);

        if(result.length>0){
            return result[0];
        }
        else
            return null;
    }

    async atualizar(){
        let sql = 'UPDATE tb_Pessoa SET pessoa_nome = ?, pessoa_telefone = ?, pessoa_endereco = ?, pessoa_senha = ? WHERE pessoa_id = ?';
        let valores = [this.#nome, this.#telefone, this.#endereco, this.#senha, this.#id];
        const banco = new Database();
        let result = await banco.ExecutaComandoNonQuery(sql, valores);
        
        return result;
    }

    toJSON(){
        return{
            id : this.#id,
            nome : this.#nome,
            telefone: this.#telefone,
            tipo: this.#tipo,
            email: this.#email,
            senha: this.#senha,
            endereco: this.#endereco
        }
    }
}
module.exports = pessoaModel;