
class pessoaModel{
    #id;
    #nome;
    #telefone;
    #tipo;

    set id(valor){ this.#id = valor}
    get id(){return this.#id}
    set nome(valor){ this.#nome = valor}
    get nome(){return this.#nome}
    set telefone(valor){ this.#telefone = valor}
    get telefone(){return this.#telefone}
    set tipo(valor){ this.#tipo = valor}
    get tipo(){return this.#tipo}

    constructor(id,nome,telefone,tipo){
        this.#id = id;
        this.#nome = nome;
        this.#telefone = telefone;
        this.#tipo = tipo;
    }
}
module.exports = pessoaModel;