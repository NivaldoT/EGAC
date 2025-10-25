const pessoaModel = require('../models/pessoaModel');
const Database = require('../utils/database');

class PFisicaModel extends pessoaModel{
    #cpf;
    #isFunc;

    set cpf(valor){ this.#cpf = valor}
    get cpf(){return this.#cpf}
    set isFunc(valor){ this.#isFunc = valor}
    get isFunc(){return this.#isFunc}

    constructor(id,nome, telefone, email, senha, cpf, isFunc){
        super(id,nome,telefone,1,email,senha);
        this.#cpf = cpf;
        this.#isFunc = isFunc;
    }

    async cadastrar(){
        const banco = new Database;

        let sql = 'start transaction;'
        await banco.ExecutaComandoNonQuery(sql);

        sql = 'insert into tb_Pessoa(pessoa_nome, pessoa_telefone, pessoa_tipo, pessoa_email, pessoa_senha) values(?,?,?,?,?);'
        let valores = [this.nome, this.telefone, this.tipo, this.email, this.senha];
        await banco.ExecutaComandoNonQuery(sql,valores);

        sql = 'set @last_id = last_insert_id();'
        await banco.ExecutaComandoNonQuery(sql);

        sql = 'insert into tb_PFisica(PF_id, PF_cpf) values(@last_id,?,?);'
        valores = [this.cpf,this.#isFunc];
        let result = await banco.ExecutaComandoNonQuery(sql,valores);

        sql = 'commit;'
        await banco.ExecutaComandoNonQuery(sql);
        
        return result;
    }

    async listar(){                                                             // where p.pessoa_tipo = 1
        const sql = 'select * from tb_PFisica pf left join tb_Pessoa p on pf.PF_id = p.pessoa_id;'
        const banco = new Database();
        const rows = await banco.ExecutaComando(sql);

        let lista = [];
        for(let i=0;i<rows.length;i++){
            lista.push(new PFisicaModel(rows[i]['PF_id'],rows[i]['pessoa_nome'],rows[i]['pessoa_telefone'],rows[i]['pessoa_tipo'],rows[i]['pessoa_email'],rows[i]['pessoa_senha'],rows[i]['PF_cpf'],rows[i]['PF_isFunc']));
        }
        return lista;
    }
    async procurarCpf(){
        let sql = 'select PF_id from tb_PFisica where PF_cpf = ?;';
        let valores = [this.#cpf];
        const banco = new Database();
        let result = await banco.ExecutaComando(sql,valores);

        // let pf = new PFisicaModel(result['0']['PF_id']);
        if(result.length>0){
            let id = result['0']['PF_id'];
            return id;
        }
        else
            return false;
    }
    async buscarId(){
        let sql = 'select * from tb_PFisica pf inner join tb_Pessoa p on pf.PF_id = p.pessoa_id where pf.PF_id = ?;'
        let valores = [this.id];
        const banco = new Database();
        let result = await banco.ExecutaComando(sql,valores);

        let pessoa = new PFisicaModel(result['0']['PF_id'],result['0']['pessoa_nome'],result['0']['pessoa_telefone'],result['0']['pessoa_tipo'], result['0']['pessoa_email'],result['0']['pessoa_senha'], result['0']['PF_cpf'], result['0']['PF_isFunc']);

        return pessoa;
    }
    async alterar(){
        let sql = 'update tb_PFisica pf, tb_Pessoa p set p.pessoa_nome = ?, p.pessoa_telefone = ?, p.pessoa_tipo = ?,  p.pessoa_email= ?, p.pessoa_senha = ?, pf.PF_cpf = ? where p.pessoa_id = ? and pf.PF_id = ?;';

        let valores = [this.nome,this.telefone,this.tipo,this.email,this.senha,this.cpf,this.id,this.id];
        const banco = new Database();
        let result = await banco.ExecutaComandoNonQuery(sql,valores);

        return result;
    }

    async logar(){                      // DEVE PUXAR UMA PESSOA FISICA E DEIXAR PASSAR CASO EXITA E SEJA FUNCIONÁRIO
        let sql = 'select * from tb_Funcionario f left join tb_PFisica pf on f.func_id = pf.PF_id left join tb_Pessoa p on pf.PF_id = p.pessoa_id where p.pessoa_email = ? and p.pessoa_senha = ?';
        let valores = [this.email, this.senha];
        const banco = new Database();
        let result = await banco.ExecutaComando(sql,valores); 
        if(result.length > 0){
            let func = new FuncionarioModel(result['0']['func_id'],result['0']['pessoa_nome'],result['0']['pessoa_telefone'],result['0']['pessoa_tipo'],result['0']['pessoa_email'],result['0']['pessoa_senha'],result['0']['PF_cpf'],result['0']['func_cargo'])
            return func;
        }
        else
            return null
    }
}
module.exports = PFisicaModel;
