const Database = require("../utils/database");

const banco = new Database();

class PedidoModel {

    #pedidoId;
    #pedidoData;
    #pedidoValorTotal;

    get pedidoId() {
        return this.#pedidoId;
    }
    set pedidoId(pedidoId){
        this.#pedidoId = pedidoId;
    }

    get pedidoData() {
        return this.#pedidoData;
    }
    set pedidoData(pedidoData){
        this.#pedidoData = pedidoData;
    }

    get pedidoValorTotal() {
        return this.#pedidoValorTotal;
    }
    set pedidoValorTotal(pedidoValorTotal){
        this.#pedidoValorTotal = pedidoValorTotal;
    }

    constructor(pedidoId, pedidoData, pedidoValorTotal) {
        this.#pedidoId = pedidoId;
        this.#pedidoData = pedidoData;
        this.#pedidoValorTotal = pedidoValorTotal;
    }

    async listar() {
        let sql = "select * from tb_Pedido";

        let valores = [];

        let rows = await banco.ExecutaComando(sql, valores);

        let listaPedidos = [];

        for(let i = 0; i < rows.length; i++) {
            let row = rows[i];
            listaPedidos.push(new PedidoModel(row["ped_id"], row["ped_data"], row["ped_valorTotal"]));
        }

        return listaPedidos;
    }

    async gravar() {
        let sql = "insert into tb_Pedido (ped_data, ped_valorTotal) values (now(), ?)";     
        let valores = [this.#pedidoValorTotal];
        
        let result = await banco.ExecutaComandoLastInserted(sql, valores);

        return result;
    }

}

module.exports = PedidoModel;
