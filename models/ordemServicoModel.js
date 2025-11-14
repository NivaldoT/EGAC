const Database = require("../utils/database");


class OrdemDeServicoModel{
    #id;
    #idPessoa;
    #nomePessoa;
    #idServico;
    #nomeServico
    #idEqAgricola;
    #nomeEqAgricola;
    #idFuncionario;
    #nomeFuncionario;
    #status;
    #dataAbertura;
    #dataConclusao;
    #comentario;

    get id(){return this.#id};
    set id(valor){this.#id = valor};
    get idPessoa(){return this.#idPessoa};
    set idPessoa(valor){this.#idPessoa = valor};
    get idServico(){return this.#idServico};
    set idServico(valor){this.#idServico = valor};
    get idEqAgricola(){return this.#idEqAgricola};
    set idEqAgricola(valor){this.#idEqAgricola = valor};
    get idFuncionario(){return this.#idFuncionario};
    set idFuncionario(valor){this.#idFuncionario = valor};
    get status(){return this.#status};
    set status(valor){this.#status = valor};
    get dataAbertura(){return this.#dataAbertura};
    set dataAbertura(valor){this.#dataAbertura = valor};
    get dataConclusao(){return this.#dataConclusao};
    set dataConclusao(valor){this.#dataConclusao = valor};
    get nomePessoa(){return this.#nomePessoa};
    set nomePessoa(valor){this.#nomePessoa = valor};
    get nomeServico(){return this.#nomeServico};
    set nomeServico(valor){this.#nomeServico = valor};
    get nomeEqAgricola(){return this.#nomeEqAgricola};
    set nomeEqAgricola(valor){this.#nomeEqAgricola = valor};
    get nomeFuncionario(){return this.#nomeFuncionario};
    set nomeFuncionario(valor){this.#nomeFuncionario = valor};
    get comentario(){return this.#comentario};
    set comentario(valor){this.#comentario = valor};
    
    constructor(id,idPessoa,idServico,idEqAgricola,idFuncionario,status,dataAbertura,dataConclusao,comentario){
        this.#id = id;
        this.#idPessoa = idPessoa;
        this.#idServico = idServico;
        this.#idEqAgricola = idEqAgricola;
        this.#idFuncionario = idFuncionario;
        this.#status = status;
        this.#dataAbertura = dataAbertura;
        this.#dataConclusao = dataConclusao;
        this.#comentario = comentario;
    }

    async abrirOS(){
        let sql = 'insert into tb_OrdemDeServico(os_idPessoa,os_idServico,os_idEqAgricola,os_idFuncionario, os_status, os_dataAbertura,os_comentario) values (?,?,?,?,?,?,?);';
        let valores = [this.#idPessoa, this.#idServico,this.#idEqAgricola,this.#idFuncionario,0,new Date(),this.#comentario];
        let banco = new Database();

        let result = await banco.ExecutaComandoNonQuery(sql,valores);
        return result;
    }

    async concluirOS(){
        let sql = 'update tb_OrdemDeServico set os_status = ?, os_dataConclusao = ?, os_comentario = ? where os_id = ?;';
        let valores = [1, this.dataConclusao, this.comentario, this.id];
        let banco = new Database();
        let result = await banco.ExecutaComandoNonQuery(sql,valores);

        return result;
    }

    async receberOS(){
        let sql = 'update tb_OrdemDeServico set os_status = ? where os_id = ?;';
        let valores = [2,this.id];
        let banco = new Database();
        let result = await banco.ExecutaComandoNonQuery(sql,valores);

        return result; 
    }

    async listar(){
        let sql = `select os_id, os_idPessoa, os_idServico,os_idEqAgricola,os_idFuncionario,os_status,os_dataAbertura,os_dataConclusao,
        os_comentario, p.pessoa_nome as nomeCliente, func.pessoa_nome as nomeFuncionario, s.serv_nome, eq.eq_nome from tb_OrdemDeServico os 
        inner join tb_Pessoa p on p.pessoa_id = os.os_idPessoa
        inner join tb_Pessoa func on func.pessoa_id = os.os_idFuncionario
        inner join tb_Servico s on s.serv_id = os.os_idServico
        inner join tb_EquipamentoAgricola eq on eq.eq_id = os.os_idEqAgricola;`;

        let banco = new Database();
        let rows = await banco.ExecutaComando(sql);

        let lista = [];
        for(let i in rows){
            lista.push(new OrdemDeServicoModel(rows[i]['os_id'],rows[i]['os_idPessoa'],rows[i]['os_idServico'],rows[i]['os_idEqAgricola'],rows[i]['os_idFuncionario'],rows[i]['os_status'],rows[i]['os_dataAbertura'],rows[i]['os_dataConclusao'],rows[i]['os_comentario']));
            lista[i].#nomePessoa = rows[i]['nomeCliente'];
            lista[i].#nomeFuncionario = rows[i]['nomeFuncionario'];
            lista[i].#nomeEqAgricola = rows[i]['eq_nome'];
            lista[i].#nomeServico = rows[i]['serv_nome'];
        }
        return lista;
    }
    async buscarId(){
        let sql = `select os_id, os_idPessoa, os_idServico,os_idEqAgricola,os_idFuncionario,os_status,os_dataAbertura,os_dataConclusao,
        os_comentario, p.pessoa_nome as nomeCliente, func.pessoa_nome as nomeFuncionario, s.serv_nome, eq.eq_nome from tb_OrdemDeServico os 
        inner join tb_Pessoa p on p.pessoa_id = os.os_idPessoa
        inner join tb_Pessoa func on func.pessoa_id = os.os_idFuncionario
        inner join tb_Servico s on s.serv_id = os.os_idServico
        inner join tb_EquipamentoAgricola eq on eq.eq_id = os.os_idEqAgricola where os.os_id = ?;`;
        let valores = [this.#id];
        let banco = new Database();
        let rows = await banco.ExecutaComando(sql,valores);

        let os = new OrdemDeServicoModel(rows['0']['os_id'],rows['0']['os_idPessoa'],rows['0']['os_idServico'],rows['0']['os_idEqAgricola'],rows['0']['os_idFuncionario'],rows['0']['os_status'],rows['0']['os_dataAbertura'],rows['0']['os_dataConclusao'],rows['0']['os_comentario']);
            os.#nomePessoa = rows['0']['nomeCliente'];
            os.#nomeFuncionario = rows['0']['nomeFuncionario'];
            os.#nomeEqAgricola = rows['0']['eq_nome'];
            os.#nomeServico = rows['0']['serv_nome'];
        
            return os;
    }

}
module.exports = OrdemDeServicoModel;