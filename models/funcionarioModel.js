const pfisicaModel = require ('../models/pfisicaModel');
const Database = require('../utils/database');
class funcionarioModel extends pfisicaModel{
    #cargo;

    // get id(){return this.#id}
    // set id(value){this.#id = value}
    get cargo(){return this.#cargo}
    set cargo(value){this.#cargo = value}

    constructor(id,nome,telefone,cpf,email,senha,cargo){
        super(id,nome,telefone,cpf,email,senha)
        this.#cargo = cargo;
    }
    async cadastrar(){
        const banco = new Database;

        let sql = 'start transaction;'
        await banco.ExecutaComandoNonQuery(sql);

        sql = 'insert into tb_Pessoa(pessoa_nome, pessoa_telefone) values(?,?);'
        let valores = [this.nome, this.telefone];
        await banco.ExecutaComandoNonQuery(sql,valores);

        sql = 'set @last_id = last_insert_id();';
        await banco.ExecutaComandoNonQuery(sql);

        sql = 'insert into tb_PFisica(PF_id, PF_cpf,PF_email,PF_senha) values(@last_id,?,?,?);';
        valores = [this.cpf,this.email, this.senha];
        await banco.ExecutaComandoNonQuery(sql,valores);

        sql = 'insert into tb_Funcionario(func_id,func_cargo) values(@last_id,?);';
        valores = [this.#cargo];
        let result = await banco.ExecutaComandoNonQuery(sql,valores);

        sql = 'commit;'
        await banco.ExecutaComandoNonQuery(sql);

        return result
    }

    async logar(){
        let sql = 'select * from tb_Funcionario f left join tb_PFisica pf on f.func_id = pf.PF_id left join tb_Pessoa p on pf.PF_id = p.pessoa_id where pf.PF_email = ? and pf.PF_senha = ?';
        let valores = [this.email, this.senha];
        const banco = new Database();
        let result = await banco.ExecutaComando(sql,valores); 
        if(result.length > 0){
            let func = new funcionarioModel(result['0']['func_id'],result['0']['pessoa_nome'],result['0']['pessoa_telefone'],result['0']['PF_cpf'],result['0']['PF_email'],result['0']['PF_senha'],result['0']['func_cargo'])
            return func;
        }
        else
            return null
    }
}
module.exports = funcionarioModel;