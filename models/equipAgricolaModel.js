const Database = require("../utils/database");

class equipAgricolaModel{
    #id;
    #idPessoa;
    #pessoa_nome;
    #nome;
    #marca;
    #marca_nome;
    #descricao;
    #categoria;
    #categoria_nome;

    set id(valor){this.#id = valor};
    get id(){return this.#id};
    set idPessoa(valor){this.#idPessoa = valor};
    get idPessoa(){return this.#idPessoa};
    set pessoa_nome(valor){this.#pessoa_nome = valor};
    get pessoa_nome(){return this.#pessoa_nome};
    set nome(valor){this.#nome = valor};
    get nome(){return this.#nome};
    set marca(valor){this.#marca = valor};
    get marca(){return this.#marca};
    set marca_nome(valor){this.#marca_nome = valor};
    get marca_nome(){return this.#marca_nome};
    set descricao(valor){this.#descricao = valor};
    get descricao(){return this.#descricao};
    set categoria(valor){this.#categoria = valor};
    get categoria(){return this.#categoria};
    set categoria_nome(valor){this.#categoria_nome = valor};
    get categoria_nome(){return this.#categoria_nome};

    constructor(id,nome,idPessoa,pessoa_nome,marca,marca_nome,descricao,categoria,categoria_nome){
        this.#id = id;
        this.#idPessoa = idPessoa;
        this.#pessoa_nome = pessoa_nome;
        this.#nome = nome;
        this.#marca = marca;
        this.#marca_nome = marca_nome;
        this.#descricao = descricao;
        this.#categoria = categoria;
        this.#categoria_nome = categoria_nome;
    }
    async cadastrar(){
        const sql = 'insert into tb_EquipamentoAgricola(eq_nome,eq_idPessoa,eq_descricao,eq_marcaId, eq_categoria) values(?,?,?,?,?)';
        const valores = [this.#nome, this.#idPessoa, this.#descricao, this.#marca, this.#categoria];
        const banco = new Database();

        let result = await banco.ExecutaComandoNonQuery(sql,valores);
        return result;
    }

    async listar(){
        const sql ='select * from tb_EquipamentoAgricola eq inner join tb_Marca m on eq.eq_marcaId = m.marca_id inner join tb_Categoria c on eq.eq_categoria = c.categoria_id inner join tb_Pessoa p on eq.eq_idPessoa = p.pessoa_id';
        const banco = new Database();
        const rows = await banco.ExecutaComando(sql);
        
        let lista = [];
        for(let i=0; i<rows.length;i++){
            lista.push(new equipAgricolaModel(rows[i]['eq_id'], rows[i]['eq_nome'], rows[i]['eq_idPessoa'], rows[i]['pessoa_nome'], rows[i]['eq_marcaId'], rows[i]['marca_nome'],rows[i]['eq_descricao'],rows[i]['eq_categoria'],rows[i]['categoria_nome']));
        }

        return lista;
    }

    async buscarId(id){
        const sql ='select * from tb_EquipamentoAgricola eq inner join tb_Marca m on eq.eq_marcaId = m.marca_id inner join tb_Categoria c on eq.eq_categoria = c.categoria_id inner join tb_Pessoa p on eq.eq_idPessoa = p.pessoa_id';
        const valores = [id];
        const banco = new Database();
        
        const result = await banco.ExecutaComando(sql,valores);
        let prod = new equipAgricolaModel(result['0']['eq_id'], result['0']['eq_nome'], result['0']['eq_idPessoa'], result['0']['pessoa_nome'], result['0']['eq_marcaId'], result['0']['marca_nome'],result['0']['eq_descricao'],result['0']['eq_categoria'],result['0']['categoria_nome']);
        return prod;
    }

    async alterar(){
        const sql = 'update tb_EquipamentoAgricola set eq_nome = ?, eq_idPessoa = ?, eq_marcaId = ?, eq_descricao = ?, eq_categoria = ? where eq_id = ?';
        const valores = [this.#nome,this.#idPessoa,this.#marca,this.#descricao,this.#categoria,this.#id];
        const banco = new Database();

        let result = await banco.ExecutaComandoNonQuery(sql,valores);
        return result;
    }

    async excluir(id){
        const sql = 'delete from tb_EquipamentoAgricola where eq_id = ?';
        const valores = [id];
        const banco = new Database();

        let result = await banco.ExecutaComandoNonQuery(sql,valores);
        return result;
    }
}

module.exports = equipAgricolaModel;