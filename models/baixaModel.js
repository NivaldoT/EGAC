const Database = require("../utils/database");

class BaixaModel {
    #id;
    #idPF;
    #data;
    #funcionario;

    set id(valor) { this.#id = valor; }
    get id() { return this.#id; }
    set idPF(valor) { this.#idPF = valor; }
    get idPF() { return this.#idPF; }
    set data(valor) { this.#data = valor; }
    get data() { return this.#data; }
    set funcionario(valor) { this.#funcionario = valor; }
    get funcionario() { return this.#funcionario; }

    constructor(id, idPF, data, funcionario = null) {
        this.#id = id;
        this.#idPF = idPF;
        this.#data = data;
        this.#funcionario = funcionario;
    }

    async gravar() {
        let sql = `INSERT INTO tb_Baixa (baixa_idPF, baixa_data) VALUES (?, ?)`;
        let valores = [this.#idPF, this.#data];

        let banco = new Database();
        let result = await banco.ExecutaComandoLastInserted(sql, valores);
        return result;
    }

    async listar(termo = null, dataInicio = null, dataFim = null) {
        let sql = `
            SELECT 
                b.baixa_id,
                b.baixa_data,
                p.pessoa_nome as funcionario_nome,
                COUNT(ib.itbaixa_id) as total_itens,
                SUM(ib.itbaixa_qtd * ib.itbaixa_valorUni) as valor_total
            FROM tb_Baixa b
            LEFT JOIN tb_PFisica pf ON b.baixa_idPF = pf.PF_id
            LEFT JOIN tb_Pessoa p ON pf.PF_id = p.pessoa_id
            LEFT JOIN tb_ItemBaixa ib ON b.baixa_id = ib.itbaixa_idBaixa
            WHERE 1=1
        `;
        
        let valores = [];

        if (termo) {
            sql += ` AND (p.pessoa_nome LIKE ? OR b.baixa_id = ?)`;
            valores.push(`%${termo}%`, termo);
        }

        if (dataInicio && dataFim) {
            sql += ` AND DATE(b.baixa_data) BETWEEN ? AND ?`;
            valores.push(dataInicio, dataFim);
        }

        sql += ` GROUP BY b.baixa_id ORDER BY b.baixa_data DESC`;

        let banco = new Database();
        let rows = await banco.ExecutaComando(sql, valores);
        
        let listaBaixas = [];
        for (let i = 0; i < rows.length; i++) {
            listaBaixas.push({
                id: rows[i].baixa_id,
                data: rows[i].baixa_data,
                funcionario: rows[i].funcionario_nome,
                totalItens: rows[i].total_itens,
                valorTotal: parseFloat(rows[i].valor_total || 0)
            });
        }
        return listaBaixas;
    }

    async buscarPorId(id) {
        let sql = `
            SELECT 
                b.baixa_id,
                b.baixa_data,
                b.baixa_idPF,
                p.pessoa_nome as funcionario_nome
            FROM tb_Baixa b
            LEFT JOIN tb_PFisica pf ON b.baixa_idPF = pf.PF_id
            LEFT JOIN tb_Pessoa p ON pf.PF_id = p.pessoa_id
            WHERE b.baixa_id = ?
        `;

        let banco = new Database();
        let rows = await banco.ExecutaComando(sql, [id]);
        
        if (rows.length > 0) {
            return new BaixaModel(
                rows[0].baixa_id,
                rows[0].baixa_idPF,
                rows[0].baixa_data,
                rows[0].funcionario_nome
            );
        }
        return null;
    }
}

module.exports = BaixaModel;
