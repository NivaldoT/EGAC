const Database = require("../utils/database");

class ItensCompraModel{
    #id;
    #idCompra;
    #idProduto;
    #nomeProduto;
    #qtd;
    #precoUnitario;

    get id(){return this.#id};
    set id(value){this.#id = value};
    get idCompra(){return this.#idCompra};
    set idCompra(value){this.#idCompra = value};
    get idProduto(){return this.#idProduto};
    set idProduto(value){this.#idProduto = value};
    get nomeProduto(){return this.#nomeProduto};
    set nomeProduto(value){this.#nomeProduto = value};
    get qtd(){return this.#qtd};
    set qtd(value){this.#qtd = value};
    get precoUnitario(){return this.#precoUnitario};
    set precoUnitario(value){this.#precoUnitario = value};

    constructor(id,idCompra,idProduto,nomeProduto,qtd,precoUnitario){
        this.#id = id;
        this.#idCompra = idCompra;
        this.#idProduto = idProduto;
        this.#nomeProduto = nomeProduto;
        this.#qtd = qtd;
        this.#precoUnitario = precoUnitario;
    }

    async gravar(){
        let sql = 'insert into tb_ItemCompra(itcomp_idCompra,itcomp_idProduto,itcomp_qtd,itcomp_precoUnitario) values(?,?,?,?)';
        let valores = [this.#idCompra,this.#idProduto,this.#qtd,this.#precoUnitario];
        let banco = new Database();
        let result = await banco.ExecutaComandoNonQuery(sql,valores)

        return result;
    }

    async listar(termoFiltragem,filtro,fornecedor,dataInicial,dataFinal){

        let sqlWhere = "";
        let sqlOrder = "";
        let valores = [];
        if(termoFiltragem) {
            //sql para filtrar pelo nro da OS
            sqlWhere = " where it.itcomp_id = " + termoFiltragem;
        }
        
        if (filtro) {
            if(filtro == 1){
                sqlOrder = 'order by it.itcomp_id desc'; 
            }
            if(filtro == 2){
                sqlOrder = 'order by c.comp_valorTotal asc'; 
            }
            if(filtro == 3){
                sqlOrder = 'order by c.comp_valorTotal desc'; 
            }
        }
        if(fornecedor){
            let separador = sqlWhere ? " and " : " where ";
            sqlWhere+= `${separador}c.comp_idFornecedor = ?`;
            valores.push(fornecedor);
        }
        
        if (dataInicial) {
            let separador = sqlWhere ? " and " : " where "; 
            sqlWhere += `${separador}c.comp_data >= ?`;
            valores.push(dataInicial);
        }

        if (dataFinal) {
            let separador = sqlWhere ? " and " : " where "; 
            sqlWhere += `${separador}c.comp_data <= ?`; 
            valores.push(dataFinal);
        }

        let sql = `select * from tb_ItemCompra it 
                    inner join tb_Produto p on p.prod_id = it.itcomp_idProduto 
                    inner join tb_Compra c on c.comp_id = it.itcomp_idCompra ${sqlWhere} ${sqlOrder};`;
        let banco = new Database();
        let rows = await banco.ExecutaComando(sql,valores);
        let lista = [];

        for(let i=0;i<rows.length;i++){
            lista.push(new ItensCompraModel(rows[i]['itcomp_id'],rows[i]['itcomp_idCompra'],rows[i]['itcomp_idProduto'],rows[i]['prod_nome'],rows[i]['itcomp_qtd'],rows[i]['itcomp_precoUnitario']));
        }
        return lista;
    }
    async listarPorCompraId(){
        let sql = 'select * from tb_ItemCompra it inner join tb_Produto p on p.prod_id = it.itcomp_idProduto where itcomp_idCompra = ?;';
        let valores = [this.#idCompra];
        let banco = new Database();
        let rows = await banco.ExecutaComando(sql,valores);
        let lista = [];

        for(let i=0;i<rows.length;i++){
            lista.push(new ItensCompraModel(rows[i]['itcomp_id'],rows[i]['itcomp_idCompra'],rows[i]['itcomp_idProduto'],rows[i]['prod_nome'],rows[i]['itcomp_qtd'],rows[i]['itcomp_precoUnitario']));
        }
        return lista;
    }


    toJSON(){
        return{
            id: this.#id,
            idCompra: this.#idCompra,
            idProduto: this.#idProduto,
            nomeProduto: this.#nomeProduto,
            qtd: this.#qtd,
            precoUnitario: this.#precoUnitario
        }
    }
}
module.exports = ItensCompraModel;