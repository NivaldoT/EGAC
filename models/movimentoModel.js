const Database = require("../utils/database");

class MovimentoModel{
    #id;
    #operacao; //1 - Conta Pagar | 2 - Conta Receber
    #idContaPagar;
    #idContaReceber;
    #valor;
    #idCaixa;
    #data;

    get id(){return this.#id};
    set id(value){this.#id = value};
    get operacao(){return this.#operacao};
    set operacao(value){this.#operacao = value};
    get idContaPagar(){return this.#idContaPagar};
    set idContaPagar(value){this.#idContaPagar = value};
    get idContaReceber(){return this.#idContaReceber};
    set idContaReceber(value){this.#idContaReceber = value};
    get valor(){return this.#valor};
    set valor(value){this.#valor = value};
    get idCaixa(){return this.#idCaixa};
    set idCaixa(value){this.#idCaixa = value};
    get data(){return this.#data};
    set data(value){this.#data = value};

    constructor(id,operacao,idContaPagar,idContaReceber,valor,idCaixa,data){
        this.#id = id;
        this.#operacao = operacao;
        this.#idContaPagar = idContaPagar;
        this.#idContaReceber = idContaReceber;
        this.#valor = valor;
        this.#idCaixa = idCaixa;
        this.#data = data;
    }

    async gravar(){
        let sql;
        let valores =[];
        if(this.#operacao == 1){
            sql = 'insert into tb_Movimento(movi_operacao,movi_idContaPagar,movi_valor,movi_idCaixa,movi_data) values(?,?,?,?,?);';
            valores = [this.#operacao,this.#idContaPagar,this.#valor,this.#idCaixa,new Date()];
        }
        if(this.#operacao == 2){
            sql = 'insert into tb_Movimento(movi_operacao,movi_idContaReceber,movi_valor,movi_idCaixa,movi_data) values(?,?,?,?,?);';
            valores = [this.#operacao,this.#idContaReceber,this.#valor,this.#idCaixa,new Date()];
        }
        let banco = new Database();
        let result = await banco.ExecutaComandoNonQuery(sql,valores);
        return result;
    }
    async listar(){
        let sql = 'select * from tb_Movimento';
        let banco = new Database();
        let rows = await banco.ExecutaComando(sql);

        let lista = [];
        for(let i = 0;i<rows.length;i++){
            lista.push(new MovimentoModel(rows[i]['movi_id'],rows[i]['movi_operacao'],rows[i]['movi_idContaPagar'],rows[i]['movi_idContaReceber'],rows[i]['movi_valor'],rows[i]['movi_idCaixa'],new Date(rows[i]['movi_data'])));
        }
        return lista;
    }
    async listarPorCaixa(idCaixa) {
        let sql = `SELECT * FROM tb_Movimento WHERE movi_idCaixa = ? ORDER BY movi_data`;
        let banco = new Database();
        return await banco.ExecutaComando(sql, [idCaixa]);
    }
}
module.exports = MovimentoModel;