const Database = require("../utils/database");
const pessoaModel = require("./pessoaModel");

class PJModel extends pessoaModel{
    #cnpj;

    set cnpj(value){this.#cnpj = value};
    get cnpj(){return this.#cnpj};
    constructor(id, nome, telefone, email, senha, cnpj){
        super(id, nome, telefone, 2, email, senha)
        this.#cnpj = cnpj;
    }

    async cadastrar(){
        const banco = new Database();

        let sql = 'start transaction;'
        await banco.ExecutaComandoNonQuery(sql);

        sql = 'insert into tb_Pessoa(pessoa_nome, pessoa_telefone, pessoa_tipo, pessoa_email, pessoa_senha) values(?,?,?,?,?);'
        let valores = [this.nome, this.telefone, this.tipo, this.email, this.senha];
        await banco.ExecutaComandoNonQuery(sql,valores);

        sql = 'set @last_id = last_insert_id();'
        await banco.ExecutaComandoNonQuery(sql);

        sql = 'insert into tb_PJuridica(PJ_id, PJ_cnpj) values(@last_id,?);'
        valores = [this.cnpj];
        let result = await banco.ExecutaComandoNonQuery(sql,valores);

        sql = 'commit;'
        await banco.ExecutaComandoNonQuery(sql);

        return result;
    }
    async listar(){
        const sql = 'select * from tb_PJuridica pj left join tb_Pessoa p on pj.PJ_id = p.pessoa_id;'
        const banco = new Database();
        const rows = await banco.ExecutaComando(sql);

        let lista = [];
        for(let i=0;i<rows.length;i++){
            lista.push(new PJModel(rows[i]['PJ_id'],rows[i]['pessoa_nome'],rows[i]['pessoa_telefone'],rows[i]['pessoa_email'],rows[i]['pessoa_senha'],rows[i]['PJ_cnpj']));
        }
        return lista;
    }
    async procurarCnpj(){
        let sql = 'select PJ_id from tb_PJuridica where PJ_cnpj = ?;';
        let valores = [this.#cnpj];
        const banco = new Database();
        let result = await banco.ExecutaComando(sql,valores);

        // let PJ = new PJisicaModel(result['0']['PJ_id']);
        if(result.length>0){
            let id = result['0']['PJ_id'];
            return id;
        }
        else
            return false;
    }
    async buscarId(){
        let sql = 'select * from tb_PJuridica pj inner join tb_Pessoa p on pj.PJ_id = p.pessoa_id where pj.PJ_id = ?;'
        let valores = [this.id];
        const banco = new Database();
        let result = await banco.ExecutaComando(sql,valores);

        let pessoa = new PJModel(result['0']['PJ_id'],result['0']['pessoa_nome'],result['0']['pessoa_telefone'], result['0']['pessoa_email'],result['0']['pessoa_senha'], result['0']['PJ_cnpj']);

        return pessoa;
    }
    async alterar(){
        let sql = 'update tb_PJuridica pj, tb_Pessoa p set p.pessoa_nome = ?, p.pessoa_telefone = ?, p.pessoa_tipo = ?,  p.pessoa_email= ?, p.pessoa_senha = ?, pj.PJ_cnpj = ? where p.pessoa_id = ? and pj.PJ_id = ?;';

        let valores = [this.nome,this.telefone,this.tipo,this.email,this.senha,this.cnpj,this.id,this.id];
        const banco = new Database();
        let result = await banco.ExecutaComandoNonQuery(sql,valores);

        return result;
    }

    async buscarFornecedorNome(){
        let sql =  `select * from tb_Pessoa p
                    inner join tb_PJuridica pj on pj.PJ_id = p.pessoa_id
                    where pessoa_nome like ?;`;
        let valores = [this.nome];
        const banco = new Database();

        let rows = await banco.ExecutaComando(sql,valores);
        
        let lista = [];
        for(let i=0;i<rows.length;i++){
            lista.push(new pessoaModel(rows[i]['pessoa_id'],rows[i]['pessoa_nome']));
        }
        return lista;
    }
}

module.exports = PJModel;