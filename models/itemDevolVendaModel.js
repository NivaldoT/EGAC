const Database = require("../utils/database");

class ItemDevolVendaModel {
    #id;
    #idDevolucao;
    #idProduto;
    #quantidade;
    #preco;
    #motivo;
    #comentario;
    #tipoReembolso;
    #foto;

    get id() { return this.#id; }
    set id(value) { this.#id = value; }
    
    get idDevolucao() { return this.#idDevolucao; }
    set idDevolucao(value) { this.#idDevolucao = value; }
    
    get idProduto() { return this.#idProduto; }
    set idProduto(value) { this.#idProduto = value; }
    
    get quantidade() { return this.#quantidade; }
    set quantidade(value) { this.#quantidade = value; }
    
    get preco() { return this.#preco; }
    set preco(value) { this.#preco = value; }
    
    get motivo() { return this.#motivo; }
    set motivo(value) { this.#motivo = value; }
    
    get foto() { return this.#foto; }
    set foto(value) { this.#foto = value; }

    get comentario() { return this.#comentario; }
    set comentario(value) { this.#comentario = value; }

    get tipoReembolso() { return this.#tipoReembolso; }
    set tipoReembolso(value) { this.#tipoReembolso = value; }

    constructor(id, idDevolucao, idProduto, quantidade, preco, motivo, comentario, foto, tipoReembolso) {
        this.#id = id;
        this.#idDevolucao = idDevolucao;
        this.#idProduto = idProduto;
        this.#quantidade = quantidade;
        this.#preco = preco;
        this.#motivo = motivo;
        this.#foto = foto;
        this.#comentario = comentario;
        this.#tipoReembolso = tipoReembolso;
    }

    async gravar() {
        let sql = `INSERT INTO tb_ItemDevoVenda 
                   (itdevo_idDevo, itdevo_idProd, itdevo_qtd, itdevo_preco, itdevo_motivo, itdevo_foto, itdevo_comentario, itdevo_tipoReembolso) 
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
        
        let valores = [this.#idDevolucao, this.#idProduto, this.#quantidade, this.#preco, this.#motivo, this.#foto, this.#comentario, this.#tipoReembolso];
        let banco = new Database();
        let result = await banco.ExecutaComandoNonQuery(sql, valores);
        return result;
    }

    async listarPorDevolucao(idDevolucao) {
        let sql = `SELECT itd.*, p.prod_nome, p.prod_imagem
                   FROM tb_ItemDevoVenda itd
                   INNER JOIN tb_Produto p ON itd.itdevo_idProd = p.prod_id
                   WHERE itd.itdevo_idDevo = ?
                   ORDER BY p.prod_nome`;
        
        let banco = new Database();
        let rows = await banco.ExecutaComando(sql, [idDevolucao]);
        
        let listaItens = [];
        for(let row of rows) {
            listaItens.push({
                id: row.itdevo_id,
                idProduto: row.itdevo_idProd,
                quantidade: row.itdevo_qtd,
                preco: row.itdevo_preco,
                motivo: row.itdevo_motivo,
                foto: row.itdevo_foto,
                produto: {
                    nome: row.prod_nome,
                    imagem1: row.prod_imagem
                },
                comentario: row.itdevo_comentario,
                tipoReembolso: row.itdevo_tipoReembolso
            });
        }
        
        return listaItens;
    }
}

module.exports = ItemDevolVendaModel;
