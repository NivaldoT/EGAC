const Database = require("../utils/database");

class ItemBaixaModel {
    #id;
    #idBaixa;
    #idProduto;
    #quantidade;
    #valorUnitario;
    #motivo;

    set id(valor) { this.#id = valor; }
    get id() { return this.#id; }
    set idBaixa(valor) { this.#idBaixa = valor; }
    get idBaixa() { return this.#idBaixa; }
    set idProduto(valor) { this.#idProduto = valor; }
    get idProduto() { return this.#idProduto; }
    set quantidade(valor) { this.#quantidade = valor; }
    get quantidade() { return this.#quantidade; }
    set valorUnitario(valor) { this.#valorUnitario = valor; }
    get valorUnitario() { return this.#valorUnitario; }
    set motivo(valor) { this.#motivo = valor; }
    get motivo() { return this.#motivo; }

    constructor(id, idBaixa, idProduto, quantidade, valorUnitario, motivo) {
        this.#id = id;
        this.#idBaixa = idBaixa;
        this.#idProduto = idProduto;
        this.#quantidade = quantidade;
        this.#valorUnitario = valorUnitario;
        this.#motivo = motivo;
    }

    async gravar() {
        let sql = `INSERT INTO tb_ItemBaixa (itbaixa_idBaixa, itbaixa_idProd, itbaixa_qtd, itbaixa_valorUni, itbaixa_motivo) 
                   VALUES (?, ?, ?, ?, ?)`;
        let valores = [this.#idBaixa, this.#idProduto, this.#quantidade, this.#valorUnitario, this.#motivo];

        let banco = new Database();
        let result = await banco.ExecutaComandoLastInserted(sql, valores);
        return result;
    }

    async listarPorBaixa(idBaixa) {
        let sql = `
            SELECT 
                ib.itbaixa_id,
                ib.itbaixa_idBaixa,
                ib.itbaixa_idProd,
                ib.itbaixa_qtd,
                ib.itbaixa_valorUni,
                ib.itbaixa_motivo,
                p.prod_nome,
                p.prod_tipo
            FROM tb_ItemBaixa ib
            INNER JOIN tb_Produto p ON ib.itbaixa_idProd = p.prod_id
            WHERE ib.itbaixa_idBaixa = ?
            ORDER BY p.prod_nome
        `;

        let banco = new Database();
        let rows = await banco.ExecutaComando(sql, [idBaixa]);
        
        let listaItens = [];
        for (let i = 0; i < rows.length; i++) {
            listaItens.push({
                id: rows[i].itbaixa_id,
                idBaixa: rows[i].itbaixa_idBaixa,
                idProduto: rows[i].itbaixa_idProd,
                produtoNome: rows[i].prod_nome,
                produtoTipo: rows[i].prod_tipo,
                quantidade: rows[i].itbaixa_qtd,
                valorUnitario: parseFloat(rows[i].itbaixa_valorUni),
                motivo: rows[i].itbaixa_motivo,
                valorTotal: rows[i].itbaixa_qtd * parseFloat(rows[i].itbaixa_valorUni)
            });
        }
        return listaItens;
    }

    async listarTodos() {
        let sql = `
            SELECT 
                ib.itbaixa_id,
                ib.itbaixa_idBaixa,
                ib.itbaixa_idProd,
                ib.itbaixa_qtd,
                ib.itbaixa_valorUni,
                ib.itbaixa_motivo,
                p.prod_nome,
                p.prod_tipo,
                b.baixa_data,
                pes.pessoa_nome as funcionario_nome
            FROM tb_ItemBaixa ib
            INNER JOIN tb_Produto p ON ib.itbaixa_idProd = p.prod_id
            INNER JOIN tb_Baixa b ON ib.itbaixa_idBaixa = b.baixa_id
            LEFT JOIN tb_PFisica pf ON b.baixa_idPF = pf.PF_id
            LEFT JOIN tb_Pessoa pes ON pf.PF_id = pes.pessoa_id
            ORDER BY b.baixa_data DESC, p.prod_nome
        `;

        let banco = new Database();
        let rows = await banco.ExecutaComando(sql);
        
        let listaItens = [];
        for (let i = 0; i < rows.length; i++) {
            listaItens.push({
                id: rows[i].itbaixa_id,
                idBaixa: rows[i].itbaixa_idBaixa,
                idProduto: rows[i].itbaixa_idProd,
                produtoNome: rows[i].prod_nome,
                produtoTipo: rows[i].prod_tipo,
                quantidade: rows[i].itbaixa_qtd,
                valorUnitario: parseFloat(rows[i].itbaixa_valorUni),
                motivo: rows[i].itbaixa_motivo,
                valorTotal: rows[i].itbaixa_qtd * parseFloat(rows[i].itbaixa_valorUni),
                data: rows[i].baixa_data,
                funcionario: rows[i].funcionario_nome
            });
        }
        return listaItens;
    }
}

module.exports = ItemBaixaModel;
