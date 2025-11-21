const Database = require("../utils/database");

const banco = new Database();

class ItemVendaModel {

    #itemVendaId;
    #vendaId;
    #produtoId;
    #itemVendaQuantidade;
    #itemVendaValor;
    #itemVendaValorTotal;
    #vendaData;
    #vendaValorTotal;
    #produtoNome;
    #pessoaNome;

    get itemVendaId() {
        return this.#itemVendaId;
    }
    set itemVendaId(itemVendaId) {
        this.#itemVendaId = itemVendaId;
    }

    get vendaId() {
        return this.#vendaId;
    }
    set vendaId(vendaId) {
        this.#vendaId = vendaId;
    }

    get produtoId() {
        return this.#produtoId;
    }
    set produtoId(produtoId) {
        this.#produtoId = produtoId;
    }

    get itemVendaQuantidade() {
        return this.#itemVendaQuantidade;
    }
    set itemVendaQuantidade(itemVendaQuantidade) {
        this.#itemVendaQuantidade = itemVendaQuantidade;
    }

    get itemVendaValor() {
        return this.#itemVendaValor;
    }
    set itemVendaValor(itemVendaValor) {
        this.#itemVendaValor = itemVendaValor;
    }

    get itemVendaValorTotal() {
        return this.#itemVendaValorTotal;
    }
    set itemVendaValorTotal(itemVendaValorTotal) {
        this.#itemVendaValorTotal = itemVendaValorTotal;
    }

    get vendaData() {
        return this.#vendaData;
    }
    set vendaData(vendaData) {
        this.#vendaData = vendaData;
    }

    get vendaValorTotal() {
        return this.#vendaValorTotal;
    }
    set vendaValorTotal(vendaValorTotal) {
        this.#vendaValorTotal = vendaValorTotal;
    }

    get produtoNome() {
        return this.#produtoNome;
    }
    set produtoNome(produtoNome) {
        this.#produtoNome = produtoNome;
    }

    get pessoaNome() {
        return this.#pessoaNome;
    }
    set pessoaNome(pessoaNome) {
        this.#pessoaNome = pessoaNome;
    }


    constructor(itemVendaId, vendaId, produtoId, 
        itemVendaQuantidade, itemVendaValor, 
        itemVendaValorTotal, vendaData, vendaValorTotal, produtoNome, pessoaNome) {
        this.#itemVendaId = itemVendaId;
        this.#vendaId = vendaId;
        this.#produtoId = produtoId;
        this.#itemVendaQuantidade = itemVendaQuantidade;
        this.#itemVendaValor = itemVendaValor;
        this.#itemVendaValorTotal = itemVendaValorTotal;
        this.#vendaData = vendaData;
        this.#vendaValorTotal = vendaValorTotal;
        this.#produtoNome = produtoNome;
        this.#pessoaNome = pessoaNome;
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
                //sql para filtrar pelo nro da venda
                sqlWhere = " where v.ven_idVenda = " + termoFiltragem;
            }
        }

        let sql = `select v.ven_idVenda, v.ven_data, v.ven_valorTotal, 
                    iv.itven_qtd, 
                    iv.itven_precoUnitario, p.prod_nome, pes.pessoa_nome
                    from tb_Venda v 
                    inner join tb_ItemVenda iv on v.ven_idVenda = iv.itven_idVenda
                    inner join tb_Produto p on p.prod_id = iv.itven_idProduto
                    left join tb_Pessoa pes on pes.pessoa_id = v.ven_idPessoa
                    ${sqlWhere}
                    order by v.ven_data desc`;

        

        let rows = await banco.ExecutaComando(sql, valores);

        let listaItens = [];

        for(let i = 0; i< rows.length; i++) {
            let row = rows[i];
            let valorTotal = row["itven_precoUnitario"] * row["itven_qtd"];
            listaItens.push(new ItemVendaModel(0, row["ven_idVenda"], 0, row["itven_qtd"], row["itven_precoUnitario"], valorTotal, row["ven_data"], row["ven_valorTotal"], row["prod_nome"], row["pessoa_nome"]));
        }

        return listaItens;
    }

    async gravar() {
        let sql = "insert into tb_ItemVenda (itven_idVenda, itven_idProduto, itven_qtd, itven_precoUnitario) values (?, ?, ?, ?)";

        let valores = [this.#vendaId, this.#produtoId, this.#itemVendaQuantidade, this.#itemVendaValor];

        let result = await banco.ExecutaComandoNonQuery(sql, valores);

        return result;
    }

    toJSON() {
        return {
            venda: this.#vendaId,
            data: this.#vendaData,
            produto: this.#produtoNome,
            cliente: this.#pessoaNome,
            quantidade: this.#itemVendaQuantidade,
            valorUnitario: this.#itemVendaValor,
            valorTotal: this.#vendaValorTotal
        };
    }

}

module.exports = ItemVendaModel;
