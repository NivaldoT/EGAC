const Database = require("../utils/database");

class CompraModel{
    #id;
    #data;
    #idFuncionario;
    #nomeFuncionario;
    #idFornecedor;
    #nomeFornecedor;
    #valorTotal;
    #qtdParcelas;
    #cnpjFornecedor;
    #telefoneFornecedor;

    get id(){return this.#id}
    set id(value){this.#id = value};
    get data(){return this.#data}
    set data(value){this.#data = value};
    get idFuncionario(){return this.#idFuncionario}
    set idFuncionario(value){this.#idFuncionario = value};
    get nomeFuncionario(){return this.#nomeFuncionario}
    set nomeFuncionario(value){this.#nomeFuncionario = value};
    get idFornecedor(){return this.#idFornecedor}
    set idFornecedor(value){this.#idFornecedor = value};
    get nomeFornecedor(){return this.#nomeFornecedor}
    set nomeFornecedor(value){this.#nomeFornecedor = value};
    get valorTotal(){return this.#valorTotal}
    set valorTotal(value){this.#valorTotal = value};
    get qtdParcelas(){return this.#qtdParcelas}
    set qtdParcelas(value){this.#qtdParcelas = value};
    get cnpjFornecedor(){return this.#cnpjFornecedor}
    set cnpjFornecedor(value){this.#cnpjFornecedor = value}
    get telefoneFornecedor(){return this.#telefoneFornecedor}
    set telefoneFornecedor(value){this.#telefoneFornecedor = value}

    constructor(id,data,idFuncionario,nomeFuncionario,idFornecedor,nomeFornecedor,valorTotal,qtdParcelas){
        this.#id = id;
        this.#data = data;
        this.#idFuncionario = idFuncionario;
        this.#nomeFuncionario = nomeFuncionario;
        this.#idFornecedor = idFornecedor;
        this.#nomeFornecedor = nomeFornecedor;
        this.#valorTotal = valorTotal;
        this.#qtdParcelas = qtdParcelas;
    }
    async gravar(){
        let sql = 'insert into tb_Compra(comp_data, comp_idFuncionario, comp_idFornecedor, comp_valorTotal, comp_qtdParcelas) values(?,?,?,?,?);';
        let valores = [this.#data,this.#idFuncionario,this.#idFornecedor,this.#valorTotal,this.#qtdParcelas];
        let banco = new Database();
        let result = await banco.ExecutaComandoLastInserted(sql,valores);
        return result;
    }

    async listar(){
        let sql = 'select *, pf.pessoa_nome as nomeCliente, pj.pessoa_nome as nomeFornecedor from tb_Compra c inner join tb_Pessoa pf on pf.pessoa_id = c.comp_idFuncionario inner join tb_Pessoa pj on pj.pessoa_id = c.comp_idFornecedor;'
        let banco = new Database();
        let rows = await banco.ExecutaComando(sql);
        let lista = [];
        for(let i=0;i<rows.length;i++){
            lista.push(new CompraModel(rows[i]['comp_id'],rows[i]['comp_data'],rows[i]['comp_idFuncionario'],rows[i]['nomeCliente'],rows[i]['comp_idFornecedor'],rows[i]['nomeFornecedor'],rows[i]['comp_valorTotal'],rows[i]['comp_qtdParcelas']));
        }
        return lista;
    }
    async buscarPorId(){
        let sql = 'select *, p.pessoa_nome as nomeFuncionario, forn.pessoa_nome as nomeFornecedor, forn.pessoa_telefone as telefoneFornecedor, pj.PJ_cnpj as cnpjFornecedor from tb_Compra c inner join tb_Pessoa p on p.pessoa_id = c.comp_idFuncionario inner join tb_Pessoa forn on forn.pessoa_id = c.comp_idFornecedor inner join tb_PJuridica pj on pj.PJ_id = forn.pessoa_id where comp_id = ?;';
        let valores = [this.#id];
        let banco = new Database();
        let rows = await banco.ExecutaComando(sql,valores);
        if(rows.length > 0){
            let compra = new CompraModel(rows[0]['comp_id'],rows[0]['comp_data'],rows[0]['comp_idFuncionario'],rows[0]['nomeFuncionario'],rows[0]['comp_idFornecedor'],rows[0]['nomeFornecedor'],rows[0]['comp_valorTotal'],rows[0]['comp_qtdParcelas']);
            compra.cnpjFornecedor = rows[0]['cnpjFornecedor'];
            compra.telefoneFornecedor = rows[0]['telefoneFornecedor'];
            return compra;
        }
        else{
            return null;
        }
    }

    toJSON(){
        return{
            id: this.#id,
            data: this.#data,
            idFuncionario: this.#idFuncionario,
            nomeFuncionario: this.#nomeFuncionario,
            idFornecedor: this.#idFornecedor,
            nomeFornecedor: this.#nomeFornecedor,
            valorTotal: this.#valorTotal,
            qtdParcelas: this.#qtdParcelas
        }
    }
}
module.exports = CompraModel;