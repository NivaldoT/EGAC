const Database = require("../utils/database");

class CaixaModel{
    #id;
    #valor;
    #status;
    #dataAbertura;
    #dataFechamento;
    #idFunc;
    #nomeFunc;

    get id(){return this.#id};
    set id(value){this.#id = value};
    get valor(){return this.#valor};
    set valor(value){this.#valor = value};
    get status(){return this.#status};
    set status(value){this.#status = value};
    get dataAbertura(){return this.#dataAbertura};
    set dataAbertura(value){this.#dataAbertura = value};
    get dataFechamento(){return this.#dataFechamento};
    set dataFechamento(value){this.#dataFechamento = value};
    get idFunc(){return this.#idFunc};
    set idFunc(value){this.#idFunc = value};
    get nomeFunc(){return this.#nomeFunc};
    set nomeFunc(value){this.#nomeFunc = value};

    constructor(id,valor,status,dataAbertura,dataFechamento,idFunc,nomeFunc){
        this.#id = id;
        this.#valor = valor;
        this.#status = status;
        this.#dataAbertura = dataAbertura;
        this.#dataFechamento = dataFechamento;
        this.#idFunc = idFunc;
        this.#nomeFunc = nomeFunc;
    }

    async buscarCaixaFunc(){ // RETORNA TRUE SE TIVER CAIXA ABERTO DO MESMO FUNCIONÁRIO, CASO NÃO TENHA, RETORNA FALSE
        let sql = 'select * from tb_Caixa inner join tb_Pessoa on pessoa_id = caixa_idFunc where caixa_status = 1 and caixa_idFunc = ?';
        let banco = new Database();
        let row = await banco.ExecutaComando(sql,[this.idFunc]);

        if(row.length>0){
            this.#id = row['0']['caixa_id'];
            this.#valor = row['0']['caixa_valor'];
            this.#status = row['0']['caixa_status'];
            this.#idFunc = row['0']['caixa_idFunc'];
            this.#nomeFunc = row['0']['pessoa_nome'];
            this.#dataAbertura = new Date(row['0']['caixa_dataAbertura']);
            return true;
        }
        else{
            return false;
        }
    }
    async abrir(){
        let sql = 'insert into tb_Caixa(caixa_valor,caixa_status,caixa_dataAbertura,caixa_idFunc) values(?,?,?,?);'
        let valores = [this.#valor,1,new Date(),this.#idFunc];
        let banco = new Database();

        let result = await banco.ExecutaComandoNonQuery(sql,valores);
        return result;
    }
    async fechar(){
        let sql = 'update tb_Caixa set caixa_status = 0, caixa_dataFechamento = ? where caixa_id = ?';
        let valores = [new Date(),this.#id];
        let banco = new Database();
        
        let result = await banco.ExecutaComandoNonQuery(sql,valores);
        return result;
    }
    async atualizarSaldo(valor){
        let sql = 'update tb_Caixa set caixa_valor = caixa_valor +(?) where caixa_id = ?;';
        let valores = [valor, this.#id];
        let banco = new Database();
        let result = await banco.ExecutaComandoNonQuery(sql,valores);
        return result;
    }

    // async buscarCaixaAberto(idFunc) {
    //     let sql = `SELECT * FROM tb_Caixa WHERE caixa_status = 1 AND caixa_idFunc = ?`;
    //     let banco = new Database();
    //     let rows = await banco.ExecutaComando(sql, [idFunc]);
    //     return rows.length > 0 ? rows[0] : null;
    // }

    // async listarMovimentos(idCaixa) {
    //     let sql = `SELECT * FROM tb_Movimento WHERE movi_idCaixa = ? ORDER BY movi_data`;
    //     let banco = new Database();
    //     return await banco.ExecutaComando(sql, [idCaixa]);
    // }
    toJSON(){
        return{
            id : this.#id,
            valor : this.#valor,
            status : this.#status,
            dataAbertura : this.#dataAbertura,
            dataFechamento : this.#dataFechamento,
            idFunc : this.#idFunc,
            nomeFunc : this.#nomeFunc
        }
    }
}
module.exports = CaixaModel;