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