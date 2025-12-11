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

    async buscarPorId(id) {
        let sql = `select v.*, p.pessoa_nome, p.pessoa_email, p.pessoa_telefone, pf.PF_cpf
                   from tb_Venda v
                   left join tb_Pessoa p on v.ven_idPessoa = p.pessoa_id
                   left join tb_PFisica pf on p.pessoa_id = pf.PF_id
                   where v.ven_idVenda = ?`;
        
        let valores = [id];
        let rows = await banco.ExecutaComando(sql, valores);
        
        if(rows.length > 0) {
            let row = rows[0];
            return {
                id: row["ven_idVenda"],
                data: row["ven_data"],
                idPessoa: row["ven_idPessoa"],
                valorTotal: row["ven_valorTotal"],
                clienteNome: row["pessoa_nome"],
                clienteEmail: row["pessoa_email"],
                clienteTelefone: row["pessoa_telefone"],
                clienteCpf: row["PF_cpf"]
            };
        }
        return null;
    }

    async gravar() {
        let sql = "insert into tb_Venda (ven_data, ven_idPessoa, ven_valorTotal) values (now(), ?, ?)";     
        let valores = [this.#vendaIdPessoa, this.#vendaValorTotal];
        
        let result = await banco.ExecutaComandoLastInserted(sql, valores);

        return result;
    }

    async listarPorCliente(emailCliente) {
        let sql = `select v.*, p.pessoa_nome, p.pessoa_email
                   from tb_Venda v
                   inner join tb_Pessoa p on v.ven_idPessoa = p.pessoa_id
                   where p.pessoa_email = ?
                   order by v.ven_data desc`;
        
        let valores = [emailCliente];
        let rows = await banco.ExecutaComando(sql, valores);
        
        let listaVendas = [];
        for(let i = 0; i < rows.length; i++) {
            let row = rows[i];
            listaVendas.push({
                id: row["ven_idVenda"],
                data: row["ven_data"],
                valorTotal: row["ven_valorTotal"],
                clienteNome: row["pessoa_nome"],
                clienteEmail: row["pessoa_email"]
            });
        }
        
        return listaVendas;
    }
    toJSON(){
        return{
            vendaId : this.#vendaId,
            vendaData : this.#vendaData,
            vendaIdPessoa : this.#vendaIdPessoa,
            vendaValorTotal : this.#vendaValorTotal
        }
    }
}

module.exports = VendaModel;
