const Database = require("../utils/database");

const banco = new Database();

class VendaModel {

    #vendaId;
    #vendaData;
    #vendaIdPessoa;
    #vendaValorTotal;

    get vendaId() {
        return this.#vendaId;
    }
    set vendaId(vendaId){
        this.#vendaId = vendaId;
    }

    get vendaData() {
        return this.#vendaData;
    }
    set vendaData(vendaData){
        this.#vendaData = vendaData;
    }

    get vendaIdPessoa() {
        return this.#vendaIdPessoa;
    }
    set vendaIdPessoa(vendaIdPessoa){
        this.#vendaIdPessoa = vendaIdPessoa;
    }

    get vendaValorTotal() {
        return this.#vendaValorTotal;
    }
    set vendaValorTotal(vendaValorTotal){
        this.#vendaValorTotal = vendaValorTotal;
    }

    constructor(vendaId, vendaData, vendaIdPessoa, vendaValorTotal) {
        this.#vendaId = vendaId;
        this.#vendaData = vendaData;
        this.#vendaIdPessoa = vendaIdPessoa;
        this.#vendaValorTotal = vendaValorTotal;
    }

    async listar() {
        let sql = "select * from tb_Venda";

        let valores = [];

        let rows = await banco.ExecutaComando(sql, valores);

        let listaVendas = [];

        for(let i = 0; i < rows.length; i++) {
            let row = rows[i];
            listaVendas.push(new VendaModel(row["ven_idVenda"], row["ven_data"], row["ven_idPessoa"], row["ven_valorTotal"]));
        }

        return listaVendas;
    }

    async gravar() {
        let sql = "insert into tb_Venda (ven_data, ven_idPessoa, ven_valorTotal) values (now(), ?, ?)";     
        let valores = [this.#vendaIdPessoa, this.#vendaValorTotal];
        
        let result = await banco.ExecutaComandoLastInserted(sql, valores);

        return result;
    }

}

module.exports = VendaModel;
