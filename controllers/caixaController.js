const CaixaModel = require("../models/caixaModel");
const PFisicaModel = require("../models/pfisicaModel");
const MovimentoModel = require("../models/movimentoModel");
const Database = require("../utils/database");

class CaixaController{

    async caixaView(req,res){
        try {
            const caixaModel = new CaixaModel();
            const caixa = await caixaModel.obterCaixaAberto();
            
            // Se tem caixa aberto, redireciona para detalhes
            if (caixa && caixa.id) {
                return res.redirect(`/admin/caixa/detalhes/${caixa.id}`);
            }
            
            // Se não tem caixa aberto, mostra formulário de abertura
            res.render('admin/caixa/index', {layout: 'layout_admin'});
        } catch (error) {
            console.error('Erro ao carregar controle de caixa:', error);
            res.status(500).send('Erro ao carregar controle de caixa');
        }
    }

    async historicoView(req, res) {
        try {
            let sql = `SELECT c.*, p.pessoa_nome as nomeFuncionario 
                       FROM tb_Caixa c
                       INNER JOIN tb_Pessoa p ON c.caixa_idFunc = p.pessoa_id
                       ORDER BY c.caixa_dataAbertura DESC`;
            
            let banco = new Database();
            let rows = await banco.ExecutaComando(sql);

            let caixas = rows.map(row => ({
                id: row.caixa_id,
                valor: row.caixa_valor,
                status: row.caixa_status,
                dataAbertura: row.caixa_dataAbertura,
                dataFechamento: row.caixa_dataFechamento,
                nomeFuncionario: row.nomeFuncionario
            }));

            res.render('admin/caixa/historico', { 
                layout: 'layout_admin',
                caixas: caixas 
            });
        } catch (error) {
            console.error('Erro ao carregar histórico:', error);
            res.status(500).send('Erro ao carregar histórico');
        }
    }

    async detalhesView(req, res) {
        try {
            const { id } = req.params;

            // Buscar dados do caixa
            let sqlCaixa = `SELECT c.*, p.pessoa_nome as nomeFuncionario 
                           FROM tb_Caixa c
                           INNER JOIN tb_Pessoa p ON c.caixa_idFunc = p.pessoa_id
                           WHERE c.caixa_id = ?`;
            
            let banco = new Database();
            let rowsCaixa = await banco.ExecutaComando(sqlCaixa, [id]);

            if (!rowsCaixa || rowsCaixa.length === 0) {
                return res.status(404).send('Caixa não encontrado');
            }

            let caixa = {
                id: rowsCaixa[0].caixa_id,
                valor: rowsCaixa[0].caixa_valor,
                status: rowsCaixa[0].caixa_status,
                dataAbertura: rowsCaixa[0].caixa_dataAbertura,
                dataFechamento: rowsCaixa[0].caixa_dataFechamento,
                nomeFuncionario: rowsCaixa[0].nomeFuncionario
            };

            // Buscar movimentos do caixa
            let sqlMovimentos = `SELECT m.*, 
                                CASE 
                                    WHEN m.movi_operacao = 0 THEN 'Abertura de Caixa'
                                    WHEN m.movi_operacao = 1 THEN 'Conta Pagar'
                                    WHEN m.movi_operacao = 2 THEN 'Conta Receber'
                                    WHEN m.movi_operacao = 3 THEN 'Entrada Manual'
                                    WHEN m.movi_operacao = 4 THEN 'Saída Manual'
                                END as tipoOperacao
                                FROM tb_Movimento m
                                WHERE m.movi_idCaixa = ?
                                ORDER BY m.movi_data ASC`;
            
            let rowsMovimentos = await banco.ExecutaComando(sqlMovimentos, [id]);

            let movimentos = [];
            for (let row of rowsMovimentos) {
                let origem = '';
                
                if (row.movi_operacao == 0) {
                    origem = row.movi_descricao || 'Abertura de Caixa';
                } else if (row.movi_operacao == 3 || row.movi_operacao == 4) {
                    // Entrada ou Saída Manual
                    origem = row.movi_descricao || 'Sem descrição';
                } else if (row.movi_operacao == 1) {
                    // Buscar origem da conta a pagar
                    let sqlOrigem = `SELECT 
                        CASE 
                            WHEN cp.contaPG_operacao = 1 THEN CONCAT('Compra #', cp.contaPG_idCompra)
                            WHEN cp.contaPG_operacao = 2 THEN CONCAT('Devolução Venda #', cp.contaPG_idDevoVenda)
                        END as origem
                        FROM tb_ContaPagar cp
                        WHERE cp.contaPG_id = ?`;
                    let origemRows = await banco.ExecutaComando(sqlOrigem, [row.movi_idContaPagar]);
                    origem = origemRows.length > 0 ? origemRows[0].origem : 'N/A';
                } else if (row.movi_operacao == 2) {
                    // Buscar origem da conta a receber
                    let sqlOrigem = `SELECT 
                        CASE 
                            WHEN cr.contaRC_operacao = 1 THEN CONCAT('Venda #', cr.contaRC_idVenda)
                            WHEN cr.contaRC_operacao = 2 THEN CONCAT('OS #', cr.contaRC_idOS)
                            WHEN cr.contaRC_operacao = 3 THEN 'Devolução Compra'
                        END as origem
                        FROM tb_ContaReceber cr
                        WHERE cr.contaRC_id = ?`;
                    let origemRows = await banco.ExecutaComando(sqlOrigem, [row.movi_idContaReceber]);
                    origem = origemRows.length > 0 ? origemRows[0].origem : 'N/A';
                }

                movimentos.push({
                    id: row.movi_id,
                    operacao: row.movi_operacao,
                    tipoOperacao: row.tipoOperacao,
                    valor: row.movi_valor,
                    data: row.movi_data,
                    origem: origem
                });
            }

            res.render('admin/caixa/detalhes', {
                layout: 'layout_admin',
                caixa: caixa,
                movimentos: movimentos
            });

        } catch (error) {
            console.error('Erro ao carregar detalhes:', error);
            res.status(500).send('Erro ao carregar detalhes');
        }
    }

    async getStatus(req,res){
        
        let func = new PFisicaModel(null,null,null,req.cookies.UsuarioEmail,req.cookies.UsuarioSenha);
        func = await func.logarEmailSenha();
        let caixa = new CaixaModel(null,null,0,null,null,func.id)
        await caixa.buscarCaixaFunc() // VERIFICA SE O FUNCIONARIO TEM UM CAIXA ABERTO
        
        res.send({caixa});
    }

    async abrir(req,res){
        let ok;
        let msg;
        let valor = parseFloat(req.body.valor);
        
        // Validar valor
        if (isNaN(valor) || valor < 0) {
            return res.send({ok: false, msg: 'Valor inválido! O valor não pode ser negativo.'});
        }
        
        let func = new PFisicaModel(null,null,null,req.cookies.UsuarioEmail,req.cookies.UsuarioSenha);
        func = await func.logarEmailSenha();

        let caixa = new CaixaModel(null,valor,null,null,null,func.id);
        if(!(await caixa.buscarCaixaFunc())){ // VERIFICA SE TEM ALGUM CAIXA ABERTO DESSE FUNCIONÁRIO
            if(await caixa.abrir()){
                // Buscar o ID do caixa recém criado
                await caixa.buscarCaixaFunc();
                
                // Criar movimento de abertura de caixa
                let banco = new Database();
                let sqlMovimento = `INSERT INTO tb_Movimento (movi_operacao, movi_valor, movi_data, movi_idCaixa, movi_descricao) 
                                   VALUES (0, ?, NOW(), ?, 'Abertura de Caixa')`;
                await banco.ExecutaComandoNonQuery(sqlMovimento, [valor, caixa.id]);
                
                ok = true;
                msg = 'Caixa aberto com Sucesso!';
            }
            else{
                ok = false;
                msg = 'Erro ao abrir caixa!';
            }
        }
        else{
            ok = false;
            msg = 'Funcionário '+func.nome+' já tem um caixa aberto! Caixa-ID = '+caixa.id;
        }
        res.send({ok,msg});
    }

    async fechar(req,res){
        let ok;
        let msg;

        let idCaixa = req.body.idCaixa;

        let caixa = new CaixaModel(idCaixa);
        if(await caixa.fechar()){
            ok = true;
            msg = 'Caixa fechado com sucesso!';
        }else{ok = false; msg = 'Erro ao Fechar Caixa!'};
        res.send({ok,msg});
    }

    async registrarMovimento(req, res) {
        let banco;
        try {
            const { tipo, descricao, valor, idCaixa } = req.body;

            if (!tipo || !valor) {
                return res.json({ ok: false, msg: 'Tipo e valor são obrigatórios' });
            }

            if (valor <= 0) {
                return res.json({ ok: false, msg: 'Valor deve ser maior que zero' });
            }

            // Se não veio idCaixa, buscar caixa aberto
            let caixaId = idCaixa;

            if (!caixaId) {
                let caixaModel = new CaixaModel();
                let caixaAberto = await caixaModel.buscarCaixaAberto();

                if (!caixaAberto) {
                    return res.json({ ok: false, msg: 'Nenhum caixa aberto no momento' });
                }
                caixaId = caixaAberto.id;
            }

            // Se for saída, verificar saldo
            if (tipo === 'saida') {
                let caixaModel = new CaixaModel();
                let caixaInfo = await caixaModel.buscarCaixaAberto();
                
                if (!caixaInfo || parseFloat(caixaInfo.valor) < parseFloat(valor)) {
                    return res.json({ ok: false, msg: 'Saldo insuficiente no caixa' });
                }
            }

            // Determinar operação: 3 = entrada manual, 4 = saída manual
            const operacao = tipo === 'entrada' ? 3 : 4;

            // Registrar movimento
            banco = new Database();
            let sql = `INSERT INTO tb_Movimento (movi_operacao, movi_valor, movi_data, movi_idCaixa, movi_descricao) 
                      VALUES (?, ?, NOW(), ?, ?)`;
            
            const resultado = await banco.ExecutaComandoNonQuery(sql, [operacao, valor, caixaId, descricao || null]);
            
            if (resultado) {
                // Atualizar saldo do caixa
                const valorAjuste = tipo === 'entrada' ? valor : -valor;
                let sqlUpdate = `UPDATE tb_Caixa SET caixa_valor = caixa_valor + ? WHERE caixa_id = ?`;
                await banco.ExecutaComandoNonQuery(sqlUpdate, [valorAjuste, caixaId]);
                
                return res.json({ ok: true, msg: 'Movimento registrado com sucesso!' });
            } else {
                return res.json({ ok: false, msg: 'Falha ao registrar movimento' });
            }

        } catch (error) {
            console.error('Erro ao registrar movimento:', error);
            console.error('Detalhes do erro:', {
                message: error.message,
                code: error.code,
                errno: error.errno,
                sqlMessage: error.sqlMessage
            });
            
            let mensagemErro = 'Erro ao registrar movimento';
            
            if (error.code === 'ECONNRESET' || error.code === 'PROTOCOL_CONNECTION_LOST') {
                mensagemErro = 'Conexão com o banco perdida. Tente novamente.';
            } else if (error.code === 'ER_DUP_ENTRY') {
                mensagemErro = 'Registro duplicado';
            } else if (error.sqlMessage) {
                mensagemErro = `Erro no banco: ${error.sqlMessage}`;
            }
            
            return res.status(500).json({ ok: false, msg: mensagemErro });
        }
    }
}

module.exports = CaixaController;