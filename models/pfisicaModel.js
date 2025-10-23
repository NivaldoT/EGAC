const pessoaModel = require('../models/pessoaModel');
const Database = require('../utils/database');

class PFisicaModel extends pessoaModel{
    #cpf;
    #email;
    #senha;

    set cpf(valor){ this.#cpf = valor}
    get cpf(){return this.#cpf}
    set email(valor){ this.#email = valor}
    get email(){return this.#email}
    set senha(valor){ this.#senha = valor}
    get senha(){return this.#senha}

    constructor(id,nome, telefone, tipo, cpf, email, senha){
        super(id,nome,telefone,tipo);
        this.#cpf = cpf;
        this.#email = email;
        this.#senha = senha;
    }

    async cadastrar(){
        const banco = new Database;

        let sql = 'start transaction;'
        await banco.ExecutaComandoNonQuery(sql);

        sql = 'insert into tb_Pessoa(pessoa_nome, pessoa_telefone, pessoa_tipo) values(?,?,?);'
        let valores = [this.nome, this.telefone, this.tipo];
        await banco.ExecutaComandoNonQuery(sql,valores);

        sql = 'set @last_id = last_insert_id();'
        await banco.ExecutaComandoNonQuery(sql);

        sql = 'insert into tb_PFisica(PF_id, PF_cpf, PF_email, PF_senha) values(@last_id,?,?,?);'
        valores = [this.cpf,this.email, this.senha];
        let result = await banco.ExecutaComandoNonQuery(sql,valores);

        sql = 'commit;'
        await banco.ExecutaComandoNonQuery(sql);
        
        return result;
    }

    async listar(){
        const sql = 'select * from tb_PFisica pf left join tb_Pessoa p on pf.PF_id = p.pessoa_id;'
        const banco = new Database();
        const rows = await banco.ExecutaComando(sql);

        let lista = [];
        for(let i=0;i<rows.length;i++){
            lista.push(new PFisicaModel(rows[i]['PF_id'],rows[i]['pessoa_nome'],rows[i]['pessoa_telefone'],rows[i]['pessoa_tipo'],rows[i]['PF_cpf'],rows[i]['PF_email'],rows[i]['PF_senha']));
        }
        return lista;
    }
}
module.exports = PFisicaModel;
