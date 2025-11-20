const Database = require("../utils/database");

const banco = new Database();

class PedidoItemModel {

    #pedidoItemId;
    #pedidoId;
    #produtoId;
    #pedidoItemQuantidade;
    #pedidoItemValor;
    #pedidoItemValorTotal;
    #pedidoData;
    #pedidoValorTotal;
    #produtoNome;

    get pedidoItemId() {
        return this.#pedidoItemId;
    }
    set pedidoItemId(pedidoItemId) {
        this.#pedidoItemId = pedidoItemId;
    }

    get pedidoId() {
        return this.#pedidoId;
    }
    set pedidoId(pedidoId) {
        this.#pedidoId = pedidoId;
    }

    get produtoId() {
        return this.#produtoId;
    }
    set produtoId(produtoId) {
        this.#produtoId = produtoId;
    }

    get pedidoItemQuantidade() {
        return this.#pedidoItemQuantidade;
    }
    set pedidoItemQuantidade(pedidoItemQuantidade) {
        this.#pedidoItemQuantidade = pedidoItemQuantidade;
    }

    get pedidoItemValor() {
        return this.#pedidoItemValor;
    }
    set pedidoItemValor(pedidoItemValor) {
        this.#pedidoItemValor = pedidoItemValor;
    }

    get pedidoItemValorTotal() {
        return this.#pedidoItemValorTotal;
    }
    set pedidoItemValorTotal(pedidoItemValorTotal) {
        this.#pedidoItemValorTotal = pedidoItemValorTotal;
    }

    get pedidoData() {
        return this.#pedidoData;
    }
    set pedidoData(pedidoData) {
        this.#pedidoData = pedidoData;
    }

    get pedidoValorTotal() {
        return this.#pedidoValorTotal;
    }
    set pedidoValorTotal(pedidoValorTotal) {
        this.#pedidoValorTotal = pedidoValorTotal;
    }

    get produtoNome() {
        return this.#produtoNome;
    }
    set produtoNome(produtoNome) {
        this.#produtoNome = produtoNome;
    }


    constructor(pedidoItemId, pedidoId, produtoId, 
        pedidoItemQuantidade, pedidoItemValor, 
        pedidoItemValorTotal, pedidoData, pedidoValorTotal, produtoNome) {
        this.#pedidoItemId = pedidoItemId;
        this.#pedidoId = pedidoId;
        this.#produtoId = produtoId;
        this.#pedidoItemQuantidade = pedidoItemQuantidade;
        this.#pedidoItemValor = pedidoItemValor;
        this.#pedidoItemValorTotal = pedidoItemValorTotal;
        this.#pedidoData = pedidoData;
        this.#pedidoValorTotal = pedidoValorTotal;
        this.#produtoNome = produtoNome;
    }

    async listar(termoFiltragem) {

        let sqlWhere = "";
        let valores = [];
        if(termoFiltragem) {
            if(isNaN(termoFiltragem)){
                //sql para filtrar pelo nome do produto
                sqlWhere = " where p.prod_nome like ? ";
                valores.push('%'+ termoFiltragem +'%')
            }
            else {
                //sql para filtrar pelo nro do pedido
                sqlWhere = " where ped.ped_id = " + termoFiltragem;
            }
        }

        let sql = `select ped.ped_id, ped.ped_data, ped.ped_valorTotal, 
                    pi.peditem_quantidade, 
                    pi.peditem_valorUnidade, pi.peditem_valorTotal, p.prod_nome
                    from tb_Pedido ped 
                    inner join tb_PedidoItens pi on ped.ped_id = pi.peditem_idPedido
                    inner join tb_Produto p on p.prod_id = pi.peditem_idProduto
                    ${sqlWhere}
                    order by ped.ped_data desc`;

        

        let rows = await banco.ExecutaComando(sql, valores);

        let listaItens = [];

        for(let i = 0; i< rows.length; i++) {
            let row = rows[i];
            listaItens.push(new PedidoItemModel(0, row["ped_id"], 0, row["peditem_quantidade"], row["peditem_valorUnidade"], row["peditem_valorTotal"], row["ped_data"], row["ped_valorTotal"], row["prod_nome"]));
        }

        return listaItens;
    }

    async gravar() {
        let sql = "insert into tb_PedidoItens (peditem_idPedido, peditem_idProduto, peditem_quantidade, peditem_valorUnidade, peditem_valorTotal) values (?, ?, ?, ?, ?)";

        let valores = [this.#pedidoId, this.#produtoId, this.#pedidoItemQuantidade, this.#pedidoItemValor, this.#pedidoItemValorTotal];

        let result = await banco.ExecutaComandoNonQuery(sql, valores);

        return result;
    }

    toJSON() {
        return {
            pedido: this.#pedidoId,
            data: this.#pedidoData,
            produto: this.#produtoNome,
            quantidade: this.#pedidoItemQuantidade,
            valorUnitario: this.#pedidoItemValor,
            valorTotal: this.#pedidoValorTotal
        };
    }

}

module.exports = PedidoItemModel;
