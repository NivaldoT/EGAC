const Database = require("../utils/database");

class itensUsadosOSModel{
    #id
    #idOS;
    #idProd;
    #nomeProd;
    #qtd;
    #precoUni;

    get id(){return this.#id};
    set id(value){this.#id = value};
    get idOS(){return this.#idOS};
    set idOS(value){this.#idOS = value};
    get idProd(){return this.#idProd};
    set idProd(value){this.#idProd = value};
    get nomeProd(){return this.#nomeProd};
    set nomeProd(value){this.#nomeProd = value};
    get qtd(){return this.#qtd};
    set qtd(value){this.#qtd = value};
    get precoUni(){return this.#precoUni};
    set precoUni(value){this.#precoUni = value};

    constructor(id,idOS,idProd,nomeProd,qtd,precoUni){
        this.#id = id;
        this.#idOS = idOS;
        this.#idProd = idProd;
        this.#nomeProd = nomeProd;
        this.#qtd = qtd;
        this.#precoUni = precoUni;
    }

    async gravar(){
        let sql = 'insert into tb_ItensUsadosOS(itos_idOS,itos_idProd,itos_qtd,itos_precoUni) values(?,?,?,?)';
        let valores = [this.#idOS, this.#idProd, this.#qtd, this.#precoUni];
        let banco = new Database();
        let result = await banco.ExecutaComandoNonQuery(sql,valores);

        return result;
    }

    async listar(){
        let sql = `
        select * from tb_ItensUsadosOS its 
        inner join tb_Produtos p on p.prod_id = its.itserv_idProd
        where itos_id = ?`;
        let valores = [this.#id];
        let banco = new Database();
        let rows = await banco.ExecutaComando(sql,valores);
        
        let lista = [];
        for(let i=0;i<rows.length;i++){
            lista.push(new itensUsadosOSModel(rows[i]['itos_id'],rows[i]['itos_idOS'],rows[i]['itos_idProd'],rows[i]['prod_nome'],rows[i]['itos_qtd'],rows[i]['itos_precoUni']));
        }
        return lista;
    }

}
module.exports = itensUsadosOSModel;