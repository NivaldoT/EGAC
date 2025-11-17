const Database = require("../utils/database");

class subItemModel{
    #id
    #idOS;
    #idFunc;
    #nomeFunc;
    #nome;
    get id(){return this.#id};
    set id(value){this.#id = value};
    get idOS(){return this.#idOS};
    set idOS(value){this.#idOS = value};
    get idFunc(){return this.#idFunc};
    set idFunc(value){this.#idFunc = value};
    get nomeFunc(){return this.#nomeFunc};
    set nomeFunc(value){this.#nomeFunc = value};
    get nome(){return this.#nome};
    set nome(value){this.#nome = value};

    constructor(id,idOS,idFunc,nomeFunc,nome){
        this.#id = id;
        this.#idOS = idOS;
        this.#idFunc = idFunc;
        this.#nomeFunc = nomeFunc;
        this.#nome = nome;
    }

    async gravar(){
        let sql = 'insert into tb_ItemServico(itserv_idOS,itserv_idFunc,itserv_nome) values(?,?,?)';
        let valores = [this.#idOS, this.#idFunc, this.#nome];
        let banco = new Database();
        let result = await banco.ExecutaComandoNonQuery(sql,valores);

        return result;
    }

    async listar(){
        let sql = `
        select * from tb_ItemServico its 
        inner join tb_Pessoa p on p.pessoa_id = its.itserv_idFunc
        where itserv_id = ?`;
        let valores = [this.id];
        let banco = new Database();
        let rows = await banco.ExecutaComando(sql,valores);
        
        let lista = [];
        for(let i=0;i<rows.length;i++){
            lista.push(new subItemModel(rows[i]['itserv_id'],rows[i]['itserv_idOS'],rows[i]['itserv_idFunc'],rows[i]['pessoa_nome'],rows[i]['itserv_nome']));
        }
        return lista;
    }

}
module.exports = subItemModel;