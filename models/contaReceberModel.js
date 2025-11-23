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

    async gravar(){
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
        let result = await banco.ExecutaComandoNonQuery(sql,valores);
        return result;
    }

    async listar(termo){
        let sqlWhere = '';
        if(termo){
            sqlWhere = 'where contaRE_id = '+termo+'';
        }
        let sql = `select * from tb_ContaReceber ${sqlWhere}`;
        let banco = new Database();
        let rows = await banco.ExecutaComando(sql);

        let lista = [];
        for(let i=0;i<rows.length;i++){
            lista.push(new ContaReceberModel(rows[i]['contaRE_id'],rows[i]['contaRE_operacao'],rows[i]['contaRE_idOS'],rows[i]['contaRE_idVenda'],rows[i]['contaRE_idDevoCompra'],rows[i]['contaRE_valor'],new Date(rows[i]['contaRE_dataVencimento']),rows[i]['contaRE_isPago'],rows[i]['contaRE_numParcela'],rows[i]['contaRE_totParcelas']));
        }
        return lista;
    }
    async buscarId(){
        let sql = 'select * from tb_ContaReceber where contaRE_id = ?';
        let valores = [this.#id];
        let banco = new Database();
        let row = await banco.ExecutaComando(sql,valores);

        let contaRE = new ContaReceberModel(row['0']['contaRE_id'],row['0']['contaRE_operacao'],row['0']['contaRE_idOS'],row['0']['contaRE_idVenda'],row['0']['contaRE_idDevoCompra'],row['0']['contaRE_valor'],row['0']['contaRE_dataVencimento'],row['0']['contaRE_isPago'],row['0']['contaRE_numParcela'],row['0']['contaRE_totParcelas']);
        return contaRE;
    }

    async receber(){
        let sql = 'update tb_ContaReceber set contaRE_isPago = 1 where contaRE_id = ?;';
        let valores = [this.#id];
        let banco = new Database();
        let result = await banco.ExecutaComandoNonQuery(sql,valores);

        return result;
    }

    toJSON(){
        return {
            id: this.#id,
            operacao: this.#operacao,
            idOS: this.#idOS,
            idVenda: this.#idVenda,
            idDevoCompra: this.#idDevoCompra,
            valor: this.#valor,
            dataVencimento: this.#dataVencimento,
            isPago: this.#isPago,
            numParcela: this.#numParcela,
            totParcelas: this.#totParcelas
        }
    }
}
module.exports = ContaReceberModel;