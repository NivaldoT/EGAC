const Database = require("../utils/database");

class ContaReceberModel{
    #id;
    #operacao;
    #idOS;
    #idVenda;
    #idDevoCompra;
    #valor;
    #dataVencimento;
    #isPago;
    #numParcela;
    #totParcelas;

    get id(){return this.#id};
    set id(valor){this.#id = valor};
    get operacao(){return this.#operacao};
    set operacao(valor){this.#operacao = valor};
    get idOS(){return this.#idOS};
    set idOS(valor){this.#idOS = valor};
    get idVenda(){return this.#idVenda};
    set idVenda(valor){this.#idVenda = valor};
    get idDevoCompra(){return this.#idDevoCompra};
    set idDevoCompra(valor){this.#idDevoCompra = valor};
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

    constructor(id,operacao,idOS,idVenda,idDevoCompra,valor,dataVencimento,isPago,numParcela,totParcelas){
        this.#id = id;
        this.#operacao = operacao ;
        this.#idOS = idOS;
        this.#idVenda = idVenda;
        this.#idDevoCompra = idDevoCompra;
        this.#valor = valor;
        this.#dataVencimento = dataVencimento ;
        this.#isPago = isPago;
        this.#numParcela = numParcela;
        this.#totParcelas = totParcelas;
    }

    gravar(){
        let sql;
        let valores;
        if(this.#operacao == 1){        //OS
            sql = 'insert into tb_ContaReceber(contaRE_operacao,contaRE_idOS,contaRE_valor,contaRE_dataVencimento,contaRE_isPago,contaRE_numParcela,contaRE_totParcelas) values(?,?,?,?,?,?,?);';
            valores = [this.#operacao, this.#idOS,this.#valor, this.#dataVencimento, this.#isPago, this.#numParcela, this.#totParcelas];

        }
        if(this.#operacao == 2){        //Venda
            sql = 'insert into tb_ContaReceber(contaRE_operacao,contaRE_idVenda,contaRE_valor,contaRE_dataVencimento,contaRE_isPago,contaRE_numParcela,contaRE_totParcelas) values(?,?,?,?,?,?,?);';
            valores = [this.#operacao, this.#idVenda,this.#valor, this.#dataVencimento, this.#isPago, this.#numParcela, this.#totParcelas];

        }
        if(this.#operacao == 3){        //Devolução de Compra
            sql = 'insert into tb_ContaReceber(contaRE_operacao,contaRE_idDevoCompra,contaRE_valor,contaRE_dataVencimento,contaRE_isPago,contaRE_numParcela,contaRE_totParcelas) values(?,?,?,?,?,?,?);';
            valores = [this.#operacao, this.#idDevoCompra,this.#valor, this.#dataVencimento, this.#isPago, this.#numParcela, this.#totParcelas];

        }
        let banco = new Database();
        let result = banco.ExecutaComandoNonQuery(sql,valores);
        return result;
    }
}
module.exports = ContaReceberModel;