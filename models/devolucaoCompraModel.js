const Database = require("../utils/database");

class DevolucaoCompraModel {
    #id;
    #idCompra;
    #idFornecedor;
    #nomeFornecedor;
    #nomeFuncionario;

    get id() { return this.#id; }
    set id(value) { this.#id = value; }
    
    get idCompra() { return this.#idCompra; }
    set idCompra(value) { this.#idCompra = value; }
    
    get idFornecedor() { return this.#idFornecedor; }
    set idFornecedor(value) { this.#idFornecedor = value; }
    
    get nomeFornecedor() { return this.#nomeFornecedor; }
    set nomeFornecedor(value) { this.#nomeFornecedor = value; }

    get nomeFuncionario() { return this.#nomeFuncionario; }
    set nomeFuncionario(value) { this.#nomeFuncionario = value; }

    constructor(id, idCompra, idFornecedor, nomeFornecedor, nomeFuncionario) {
        this.#id = id;
        this.#idCompra = idCompra;
        this.#idFornecedor = idFornecedor;
        this.#nomeFornecedor = nomeFornecedor;
        this.#nomeFuncionario = nomeFuncionario;
    }

    async gravar() {
        let sql = `INSERT INTO tb_DevolucaoCompra (devo_idCompra) VALUES (?)`;
        
        let valores = [this.#idCompra];
        let banco = new Database();
        let result = await banco.ExecutaComandoLastInserted(sql, valores);
        return result;
    }

    async listar() {
        let sql = `SELECT d.devo_id, d.devo_idCompra,forn.pessoa_id as idFornecedor, forn.pessoa_nome as nomeFornecedor, func.pessoa_nome as nomeFuncionario 
                   FROM tb_DevolucaoCompra d
                   INNER JOIN tb_Compra c ON d.devo_idCompra = c.comp_id
                   INNER JOIN tb_Pessoa func ON c.comp_idFuncionario = func.pessoa_id
                   INNER JOIN tb_Pessoa forn ON c.comp_idFornecedor = forn.pessoa_id;`;
        
        let banco = new Database();
        let rows = await banco.ExecutaComando(sql, []);
        
        let lista = [];
        if(rows.length > 0) {
            for(let i=0; i<rows.length; i++) {
                lista.push(new DevolucaoCompraModel(rows[i]['devo_id'], rows[i]['devo_idCompra'], rows[i]['idFornecedor'], rows[i]['nomeFornecedor'], rows[i]['nomeFuncionario']));
            }
        }
        
        return lista;
    }
    async buscarPorIdCompra() {
        let sql = ` select * from tb_DevolucaoCompra where devo_idCompra = ?;`;
        let valores = [this.#idCompra];
        let banco = new Database();
        let rows = await banco.ExecutaComando(sql, valores);
        if(rows.length > 0) {
            return new DevolucaoCompraModel(rows[0]['devo_id'], rows[0]['devo_idCompra']);
        }
        return null;
    }

    async listarPorCliente(emailCliente) {
        let sql = `SELECT d.devo_id, d.devo_idCompra, d.devo_status,
                   v.ven_data, v.ven_valorTotal
                   FROM tb_DevolucaoCompra d
                   INNER JOIN tb_Compra v ON d.devo_idCompra = v.ven_idCompra
                   INNER JOIN tb_Pessoa p ON v.ven_idPessoa = p.pessoa_id
                   WHERE p.pessoa_email = ?
                   ORDER BY d.devo_id DESC`;
        
        let banco = new Database();
        let rows = await banco.ExecutaComando(sql, [emailCliente]);
        
        let listaDevolucoes = [];
        for(let row of rows) {
            listaDevolucoes.push({
                id: row.devo_id,
                idCompra: row.devo_idCompra,
                motivo: 'Ver itens',
                status: row.devo_status,
                tipoReembolso: 'Ver itens',
                foto: null,
                Compra: {
                    data: row.ven_data,
                    valorTotal: row.ven_valorTotal
                }
            });
        }
        
        return listaDevolucoes;
    }

    async buscarPorId(id) {
        let sql = `SELECT d.devo_id, d.devo_idCompra, d.devo_status,
                   v.ven_data, v.ven_valorTotal,
                   p.pessoa_nome as cliente_nome, p.pessoa_email as cliente_email, p.pessoa_id as cliente_id,
                   p.pessoa_telefone as cliente_telefone
                   FROM tb_DevolucaoCompra d
                   INNER JOIN tb_Compra v ON d.devo_idCompra = v.ven_idCompra
                   INNER JOIN tb_Pessoa p ON v.ven_idPessoa = p.pessoa_id
                   WHERE d.devo_id = ?`;
        
        let banco = new Database();
        let rows = await banco.ExecutaComando(sql, [id]);
        
        if(rows.length > 0) {
            let row = rows[0];
            return {
                id: row.devo_id,
                idCompra: row.devo_idCompra,
                motivo: 'Veja Itens',
                status: row.devo_status,
                tipoReembolso: 'Veja Itens',
                foto: null,
                Compra: {
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
        let sql = `UPDATE tb_DevolucaoCompra 
                   SET devo_status = 'aprovada'
                   WHERE devo_id = ?`;
        
        let banco = new Database();
        let result = await banco.ExecutaComandoNonQuery(sql, [this.#id]);
        return result;
    }

    async recusar() {
        let sql = `UPDATE tb_DevolucaoCompra 
                   SET devo_status = 'recusada'
                   WHERE devo_id = ?`;
        
        let banco = new Database();
        let result = await banco.ExecutaComandoNonQuery(sql, [this.#id]);
        return result;
    }

    async verificarDevolucaoExistente(idCompra) {
        let sql = `SELECT devo_id, devo_status 
                   FROM tb_DevolucaoCompra 
                   WHERE devo_idCompra = ?
                   AND devo_status IN ('pendente', 'aprovada')`;
        
        let banco = new Database();
        let rows = await banco.ExecutaComando(sql, [idCompra]);
        
        return rows.length > 0 ? rows[0] : null;
    }
}

module.exports = DevolucaoCompraModel;
