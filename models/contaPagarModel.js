const Database = require("../utils/database");

class ContaPagarModel{
    #id;
    #operacao;
    #idCompra;
    #idDevoVenda;
    #valor;
    #dataVencimento;
    #isPago;
    #numParcela;
    #totParcelas;

    get id(){return this.#id};
    set id(valor){this.#id = valor};
    get operacao(){return this.#operacao};
    set operacao(valor){this.#operacao = valor};
    get idCompra(){return this.#idCompra};
    set idCompra(valor){this.#idCompra = valor};
    get idDevoVenda(){return this.#idDevoVenda};
    set idDevoVenda(valor){this.#idDevoVenda = valor};
    get valor(){return this.#valor};
    set valor(valor){this.#valor = valor};
    get dataVencimento(){return this.#dataVencimento};
    set dataVencimento(valor){this.#dataVencimento = valor};
    get isPago(){return this.#isPago};
    set isPago(valor){this.#isPago = valor};
    get numParcela(){return this.#numParcela};
    set numParcela(valor){this.#numParcela = valor};
    get totParcelas(){return this.#totParcelas};
    set totParcelas(valor){this.#totParcelas = valor};

    constructor(id,operacao,idCompra,idDevoVenda,valor,dataVencimento,isPago,numParcela,totParcelas){
        this.#id = id;
        this.#operacao = operacao ;
        this.#idCompra = idCompra;
        this.#idDevoVenda = idDevoVenda;
        this.#valor = valor;
        this.#dataVencimento = dataVencimento ;
        this.#isPago = isPago;
        this.#numParcela = numParcela;
        this.#totParcelas = totParcelas;
    }

    gravar(){
        let sql;
        let valores;
        if(this.#operacao == 1){        //Compra
            sql = 'insert into tb_ContaPagar(contaPG_operacao,contaPG_idCompra,contaPG_valor,contaPG_dataVencimento,contaPG_isPago,contaPG_numParcela,contaPG_totParcelas) values(?,?,?,?,?,?,?);';
            valores = [this.#operacao, this.#idCompra,this.#valor, this.#dataVencimento, this.#isPago, this.#numParcela, this.#totParcelas];

        }
        if(this.#operacao == 2){        //Devolução de Venda
            sql = 'insert into tb_ContaPagar(contaPG_operacao,contaPG_idDevoVenda,contaPG_valor,contaPG_dataVencimento,contaPG_isPago,contaPG_numParcela,contaPG_totParcelas) values(?,?,?,?,?,?,?);';
            valores = [this.#operacao, this.#idDevoVenda,this.#valor, this.#dataVencimento, this.#isPago, this.#numParcela, this.#totParcelas];

        }
        let banco = new Database();
        let result = banco.ExecutaComandoNonQuery(sql,valores);
        return result;
    }
}
module.exports = ContaPagarModel;