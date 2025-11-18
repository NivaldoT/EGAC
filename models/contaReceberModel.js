const Database = require("../utils/database");

class ContaReceberModel{ // receber = 1 // Pagar = 2
    #id;
    #operacao;
    #idOperacao;
    #dataVencimento;
    #isPago;
    #numParcela;
    #totParcelas;

    get id(){return this.#id};
    set id(valor){this.#id = valor};
    get operacao(){return this.#operacao};
    set operacao(valor){this.#operacao = valor};
    get idOperacao(){return this.#idOperacao};
    set idOperacao(valor){this.#idOperacao = valor};
    get dataVencimento(){return this.#dataVencimento};
    set dataVencimento(valor){this.#dataVencimento = valor};
    get isPago(){return this.#isPago};
    set isPago(valor){this.#isPago = valor};
    get numParcela(){return this.#numParcela};
    set numParcela(valor){this.#numParcela = valor};
    get totParcelas(){return this.#totParcelas};
    set totParcelas(valor){this.#totParcelas = valor};

    constructor(id,operacao,idOperacao,dataVencimento,isPago,numParcela,totParcelas){
        this.#id = id;
        this.#operacao =operacao ;
        this.#idOperacao = idOperacao;
        this.#dataVencimento =dataVencimento ;
        this.#isPago = isPago;
        this.#numParcela = numParcela;
        this.#totParcelas = totParcelas;
    }

    gravar(){
        let sql = 'insert into tb_ContaReceber(contaRE_operacao,contaRE_idOperacao,contaRE_dataVencimento,contaRE_isPago,contaRE_numParcela,contaRE_totParcelas) values(?,?,?,?,?,?);';
        let valores = [this.#operacao, this.#idOperacao, this.#dataVencimento, this.#isPago, this.#numParcela, this.#totParcelas];
        let banco = new Database();
        let result = banco.ExecutaComandoNonQuery(sql,valores);
        return result;
    }
}
module.exports = ContaReceberModel;