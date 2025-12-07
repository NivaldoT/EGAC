const Database = require('../utils/database');

class FinanceiroController {

    // Listar movimentações financeiras
    async listarMovimentacoes(req, res) {
        try {
            const { tipo } = req.query; // 'entrada', 'saida', ou null para todas

            let sql = `SELECT m.*, c.cx_dataAbertura, c.cx_valorInicial, c.cx_valorFinal, c.cx_status
                       FROM tb_Movimento m
                       LEFT JOIN tb_Caixa c ON m.mov_idCaixa = c.cx_id`;
            
            let filtros = [];
            let parametros = [];

            if (tipo === 'entrada') {
                filtros.push("m.mov_tipo = 'entrada'");
            } else if (tipo === 'saida') {
                filtros.push("m.mov_tipo = 'saida'");
            }

            if (filtros.length > 0) {
                sql += ' WHERE ' + filtros.join(' AND ');
            }

            sql += ' ORDER BY m.mov_data DESC, m.mov_id DESC';

            let banco = new Database();
            let rows = await banco.ExecutaComando(sql, parametros);

            let movimentacoes = rows.map(row => ({
                id: row.mov_id,
                tipo: row.mov_tipo,
                descricao: row.mov_descricao,
                valor: parseFloat(row.mov_valor),
                data: row.mov_data,
                idCaixa: row.mov_idCaixa,
                idPessoa: row.mov_idPessoa,
                caixa: {
                    dataAbertura: row.cx_dataAbertura,
                    status: row.cx_status
                }
            }));

            // Calcular totais
            let totalEntradas = movimentacoes
                .filter(m => m.tipo === 'entrada')
                .reduce((sum, m) => sum + m.valor, 0);

            let totalSaidas = movimentacoes
                .filter(m => m.tipo === 'saida')
                .reduce((sum, m) => sum + m.valor, 0);

            let saldoAtual = totalEntradas - totalSaidas;

            res.render('admin/financeiro/movimentacoes', {
                layout: 'layout_admin',
                movimentacoes: movimentacoes,
                totalEntradas: totalEntradas,
                totalSaidas: totalSaidas,
                saldoAtual: saldoAtual,
                filtroAtivo: tipo || 'todas'
            });

        } catch (error) {
            console.error('Erro ao listar movimentações:', error);
            res.status(500).send('Erro ao carregar movimentações');
        }
    }

    // Incluir novo lançamento
    async incluirLancamento(req, res) {
        try {
            const { tipo, descricao, valor, idPessoa } = req.body;

            if (!tipo || !descricao || !valor) {
                return res.status(400).json({ ok: false, msg: 'Todos os campos são obrigatórios' });
            }

            // Verificar se existe caixa aberto
            let banco = new Database();
            let sqlCaixa = `SELECT cx_id FROM tb_Caixa WHERE cx_status = 'aberto' ORDER BY cx_id DESC LIMIT 1`;
            let caixas = await banco.ExecutaComando(sqlCaixa, []);

            if (!caixas || caixas.length === 0) {
                return res.status(400).json({ ok: false, msg: 'Nenhum caixa está aberto no momento' });
            }

            let idCaixa = caixas[0].cx_id;

            // Inserir movimento
            let sqlMovimento = `INSERT INTO tb_Movimento (mov_tipo, mov_descricao, mov_valor, mov_data, mov_idCaixa, mov_idPessoa)
                               VALUES (?, ?, ?, NOW(), ?, ?)`;
            
            let parametros = [tipo, descricao, parseFloat(valor), idCaixa, idPessoa || null];
            
            await banco.ExecutaComandoNonQuery(sqlMovimento, parametros);

            return res.json({ ok: true, msg: 'Lançamento incluído com sucesso!' });

        } catch (error) {
            console.error('Erro ao incluir lançamento:', error);
            return res.status(500).json({ ok: false, msg: 'Erro ao incluir lançamento: ' + error.message });
        }
    }

    // Buscar detalhes do lançamento
    async detalharLancamento(req, res) {
        try {
            const { id } = req.params;

            let banco = new Database();
            let sql = `SELECT m.*, 
                       p.pessoa_nome, p.pessoa_email, p.pessoa_cpf, p.pessoa_cnpj,
                       c.cx_dataAbertura, c.cx_valorInicial, c.cx_status
                       FROM tb_Movimento m
                       LEFT JOIN tb_Pessoa p ON m.mov_idPessoa = p.pessoa_id
                       LEFT JOIN tb_Caixa c ON m.mov_idCaixa = c.cx_id
                       WHERE m.mov_id = ?`;

            let rows = await banco.ExecutaComando(sql, [id]);

            if (!rows || rows.length === 0) {
                return res.status(404).json({ ok: false, msg: 'Movimento não encontrado' });
            }

            let row = rows[0];
            let movimento = {
                id: row.mov_id,
                tipo: row.mov_tipo,
                descricao: row.mov_descricao,
                valor: parseFloat(row.mov_valor),
                data: row.mov_data,
                idCaixa: row.mov_idCaixa,
                caixa: {
                    dataAbertura: row.cx_dataAbertura,
                    valorInicial: row.cx_valorInicial,
                    status: row.cx_status
                },
                pessoa: row.pessoa_nome ? {
                    nome: row.pessoa_nome,
                    email: row.pessoa_email,
                    cpf: row.pessoa_cpf,
                    cnpj: row.pessoa_cnpj
                } : null
            };

            return res.json({ ok: true, movimento: movimento });

        } catch (error) {
            console.error('Erro ao detalhar lançamento:', error);
            return res.status(500).json({ ok: false, msg: 'Erro ao buscar detalhes' });
        }
    }

    // Listar pessoas (clientes e fornecedores) para o select
    async listarPessoas(req, res) {
        try {
            let banco = new Database();
            let sql = `SELECT pessoa_id, pessoa_nome, pessoa_cpf, pessoa_cnpj 
                       FROM tb_Pessoa 
                       ORDER BY pessoa_nome`;
            
            let rows = await banco.ExecutaComando(sql, []);

            let pessoas = rows.map(row => ({
                id: row.pessoa_id,
                nome: row.pessoa_nome,
                tipo: row.pessoa_cpf ? 'Cliente' : 'Fornecedor'
            }));

            return res.json({ ok: true, pessoas: pessoas });

        } catch (error) {
            console.error('Erro ao listar pessoas:', error);
            return res.status(500).json({ ok: false, msg: 'Erro ao listar pessoas' });
        }
    }
}

module.exports = FinanceiroController;
