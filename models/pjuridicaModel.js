const Database = require("../utils/database");
const pessoaModel = require("./pessoaModel");

class PJModel extends pessoaModel{
    #cnpj;
    #email;
    #senha;

    set cnpj(value){this.#cnpj = value};
    get cnpj(){return this.#cnpj};
    set email(value){this.#email = value};
    get email(){return this.#email};
    set senha(value){this.#senha = value};
    get senha(){return this.#senha};

    constructor(id, nome, telefone, tipo, cnpj, email, senha){
        super(id, nome, telefone, tipo)
        this.#cnpj = cnpj;
        this.#email = email;
        this.#senha = senha; 
    }

    async cadastrar(){
        const banco = new Database();

        let sql = 'start transaction;'
        await banco.ExecutaComandoNonQuery(sql);

        sql = 'insert into tb_Pessoa(pessoa_nome, pessoa_telefone, pessoa_tipo) values(?,?,?);'
        let valores = [this.nome, this.telefone, this.tipo];
        await banco.ExecutaComandoNonQuery(sql,valores);

        sql = 'set @last_id = last_insert_id();'
        await banco.ExecutaComandoNonQuery(sql);

        sql = 'insert into tb_PJuridica(PJ_id, PJ_cnpj, PJ_email, PJ_senha) values(@last_id,?,?,?);'
        valores = [this.cnpj,this.email, this.senha];
        let result = await banco.ExecutaComandoNonQuery(sql,valores);

        sql = 'commit;'
        await banco.ExecutaComandoNonQuery(sql);
        
        console.log(result);
        return result;
    }

    async listar(){
        const sql = 'select * from tb_PJuridica pj left join tb_Pessoa p on pj.PJ_id = p.pessoa_id;'
        const banco = new Database();
        const rows = await banco.ExecutaComando(sql);

        let lista = [];
        for(let i=0;i<rows.length;i++){
            lista.push(new PJModel(rows[i]['PJ_id'],rows[i]['pessoa_nome'],rows[i]['pessoa_telefone'],rows[i]['pessoa_tipo'],rows[i]['PJ_cnpj'],rows[i]['PJ_email'],rows[i]['PJ_senha']));
        }
        return lista;
    }
}

module.exports = PJModel;