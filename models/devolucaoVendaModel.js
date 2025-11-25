const Database = require("../utils/database");

class DevolucaoVendaModel {
    #id;
    #idVenda;
    #idCliente;
    #motivo;
    #status;
    #tipoReembolso;
    #foto;
    #dataSolicitacao;
    #dataConclusao;

    get id() { return this.#id; }
    set id(value) { this.#id = value; }
    
    get idVenda() { return this.#idVenda; }
    set idVenda(value) { this.#idVenda = value; }
    
    get idCliente() { return this.#idCliente; }
    set idCliente(value) { this.#idCliente = value; }
    
    get motivo() { return this.#motivo; }
    set motivo(value) { this.#motivo = value; }
    
    get status() { return this.#status; }
    set status(value) { this.#status = value; }
    
    get tipoReembolso() { return this.#tipoReembolso; }
    set tipoReembolso(value) { this.#tipoReembolso = value; }
    
    get foto() { return this.#foto; }
    set foto(value) { this.#foto = value; }
    
    get dataSolicitacao() { return this.#dataSolicitacao; }
    set dataSolicitacao(value) { this.#dataSolicitacao = value; }
    
    get dataConclusao() { return this.#dataConclusao; }
    set dataConclusao(value) { this.#dataConclusao = value; }

    constructor(id, idVenda, idCliente, motivo, status, tipoReembolso, foto, dataSolicitacao, dataConclusao) {
        this.#id = id;
        this.#idVenda = idVenda;
        this.#idCliente = idCliente;
        this.#motivo = motivo;
        this.#status = status;
        this.#tipoReembolso = tipoReembolso;
        this.#foto = foto;
        this.#dataSolicitacao = dataSolicitacao;
        this.#dataConclusao = dataConclusao;
    }

    async gravar() {
        let sql = `INSERT INTO tb_DevolucaoVenda 
                   (devo_idVenda, devo_status) 
                   VALUES (?, 'pendente')`;
        
        let valores = [this.#idVenda];
        let banco = new Database();
        let result = await banco.ExecutaComandoLastInserted(sql, valores);
        return result;
    }

    async listar() {
        let sql = `SELECT d.devo_id, d.devo_idVenda, d.devo_status,
                   v.ven_data, v.ven_valorTotal,
                   p.pessoa_nome as cliente_nome, p.pessoa_email as cliente_email
                   FROM tb_DevolucaoVenda d
                   INNER JOIN tb_Venda v ON d.devo_idVenda = v.ven_idVenda
                   INNER JOIN tb_Pessoa p ON v.ven_idPessoa = p.pessoa_id
                   ORDER BY d.devo_id DESC`;
        
        let banco = new Database();
        let rows = await banco.ExecutaComando(sql, []);
        
        let listaDevolucoes = [];
        for(let row of rows) {
            listaDevolucoes.push({
                id: row.devo_id,
                idVenda: row.devo_idVenda,
                motivo: 'Ver detalhes',
                status: row.devo_status,
                tipoReembolso: 'Ver detalhes',
                foto: null,
                venda: {
                    data: row.ven_data,
                    valorTotal: row.ven_valorTotal
                },
                cliente: {
                    nome: row.cliente_nome,
                    email: row.cliente_email
                }
            });
        }
        
        return listaDevolucoes;
    }

    async listarPorCliente(emailCliente) {
        let sql = `SELECT d.devo_id, d.devo_idVenda, d.devo_status,
                   v.ven_data, v.ven_valorTotal
                   FROM tb_DevolucaoVenda d
                   INNER JOIN tb_Venda v ON d.devo_idVenda = v.ven_idVenda
                   INNER JOIN tb_Pessoa p ON v.ven_idPessoa = p.pessoa_id
                   WHERE p.pessoa_email = ?
                   ORDER BY d.devo_id DESC`;
        
        let banco = new Database();
        let rows = await banco.ExecutaComando(sql, [emailCliente]);
        
        let listaDevolucoes = [];
        for(let row of rows) {
            listaDevolucoes.push({
                id: row.devo_id,
                idVenda: row.devo_idVenda,
                motivo: 'Ver itens',
                status: row.devo_status,
                tipoReembolso: 'Ver itens',
                foto: null,
                venda: {
                    data: row.ven_data,
                    valorTotal: row.ven_valorTotal
                }
            });
        }
        
        return listaDevolucoes;
    }

    async buscarPorId(id) {
        let sql = `SELECT d.devo_id, d.devo_idVenda, d.devo_status,
                   v.ven_data, v.ven_valorTotal,
                   p.pessoa_nome as cliente_nome, p.pessoa_email as cliente_email, p.pessoa_id as cliente_id,
                   p.pessoa_telefone as cliente_telefone
                   FROM tb_DevolucaoVenda d
                   INNER JOIN tb_Venda v ON d.devo_idVenda = v.ven_idVenda
                   INNER JOIN tb_Pessoa p ON v.ven_idPessoa = p.pessoa_id
                   WHERE d.devo_id = ?`;
        
        let banco = new Database();
        let rows = await banco.ExecutaComando(sql, [id]);
        
        if(rows.length > 0) {
            let row = rows[0];
            return {
                id: row.devo_id,
                idVenda: row.devo_idVenda,
                motivo: 'Ver itens',
                status: row.devo_status,
                tipoReembolso: 'Ver itens',
                foto: null,
                venda: {
                    data: row.ven_data,
                    valorTotal: row.ven_valorTotal
                },
                cliente: {
                    id: row.cliente_id,
                    nome: row.cliente_nome,
                    email: row.cliente_email
                }
            };
        }
        
        return null;
    }

    async aprovar() {
        let sql = `UPDATE tb_DevolucaoVenda 
                   SET devo_status = 'aprovada'
                   WHERE devo_id = ?`;
        
        let banco = new Database();
        let result = await banco.ExecutaComandoNonQuery(sql, [this.#id]);
        return result;
    }

    async recusar() {
        let sql = `UPDATE tb_DevolucaoVenda 
                   SET devo_status = 'recusada'
                   WHERE devo_id = ?`;
        
        let banco = new Database();
        let result = await banco.ExecutaComandoNonQuery(sql, [this.#id]);
        return result;
    }

    async verificarDevolucaoExistente(idVenda) {
        let sql = `SELECT devo_id, devo_status 
                   FROM tb_DevolucaoVenda 
                   WHERE devo_idVenda = ?
                   AND devo_status IN ('pendente', 'aprovada')`;
        
        let banco = new Database();
        let rows = await banco.ExecutaComando(sql, [idVenda]);
        
        return rows.length > 0 ? rows[0] : null;
    }
}

module.exports = DevolucaoVendaModel;
