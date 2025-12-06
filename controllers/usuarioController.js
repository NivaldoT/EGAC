const DevolucaoVendaModel = require('../models/devolucaoVendaModel');
const ItemVendaModel = require('../models/pedidoItemModel');
const VendaModel = require('../models/pedidoModel');
const pessoaModel = require('../models/pessoaModel');
const pfisicaModel = require('../models/pfisicaModel');

class UsuarioController {

    loginView(req, res) {
        res.render('usuario/usuarioLogin');
    }
    cadastroView(req, res) {
        res.render('usuario/usuarioCadastro');
    }

    async perfilView(req, res) {
        try {
            const email = req.cookies.UsuarioEmail;
            const senha = req.cookies.UsuarioSenha;

            if (!email || !senha) {
                return res.redirect('/usuario/login');
            }

            // Buscar dados da pessoa
            let pessoa = new pessoaModel(null, null, null, null, email, senha);
            pessoa = await pessoa.logarEmailSenha();

            if (!pessoa) {
                return res.redirect('/usuario/login');
            }

            // Buscar dados de PF se for pessoa física
            let dadosPF = null;
            if (pessoa.tipo == 1) {
                let pf = new pfisicaModel(null, null, null, email, senha);
                dadosPF = await pf.logarEmailSenha();
            }

            res.render('usuario/usuarioPerfil', { pessoa, dadosPF });
        } catch (error) {
            console.error('Erro ao carregar perfil:', error);
            res.redirect('/usuario/login');
        }
    }

    async atualizarPerfil(req, res) {
        try {
            const email = req.cookies.UsuarioEmail;
            const senha = req.cookies.UsuarioSenha;

            if (!email || !senha) {
                return res.send({ ok: false, msg: 'Usuário não autenticado' });
            }

            const { nome, telefone, endereco, novaSenha } = req.body;

            // Buscar pessoa atual
            let pessoa = new pessoaModel(null, null, null, null, email, senha);
            pessoa = await pessoa.logarEmailSenha();

            if (!pessoa) {
                return res.send({ ok: false, msg: 'Usuário não encontrado' });
            }

            // Atualizar dados
            const senhaFinal = novaSenha || senha;
            let pessoaAtualizada = new pessoaModel(
                pessoa.id,
                nome,
                telefone,
                pessoa.tipo,
                email,
                senhaFinal,
                endereco
            );

            const resultado = await pessoaAtualizada.atualizar();

            if (resultado) {
                // Atualizar cookies se senha foi alterada
                if (novaSenha) {
                    res.cookie('UsuarioSenha', novaSenha);
                }
                res.cookie('UsuarioNome', nome);

                res.send({ ok: true, msg: 'Perfil atualizado com sucesso!' });
            } else {
                res.send({ ok: false, msg: 'Erro ao atualizar perfil' });
            }
        } catch (error) {
            console.error('Erro ao atualizar perfil:', error);
            res.send({ ok: false, msg: 'Erro ao atualizar perfil' });
        }
    }
    async minhasComprasView(req, res) {
        try {
            // Pegar email do cookie
            const userEmail = req.cookies.UsuarioEmail;
            const userSenha = req.cookies.UsuarioSenha;
            
            console.log('=== MINHAS COMPRAS DEBUG ===');
            console.log('Todos os cookies:', req.cookies);
            console.log('UsuarioEmail:', userEmail);
            console.log('UsuarioSenha:', userSenha ? 'existe' : 'NÃO EXISTE');
            
            if (!userEmail) {
                console.log('❌ Redirecionando - email não encontrado');
                return res.redirect('/usuario/login');
            }

            // Buscar vendas do cliente
            let vendaModel = new VendaModel();
            let vendas = await vendaModel.listarPorCliente(userEmail);
            
            console.log('✅ Total de vendas:', vendas.length);

            // Para cada venda, buscar os itens e verificar se há devolução
            let itemVendaModel = new ItemVendaModel();
            let devolucaoModel = new DevolucaoVendaModel();
            
            for(let venda of vendas) {
                venda.itens = await itemVendaModel.listarPorVenda(venda.id);
                // Verificar se existe devolução para esta venda
                venda.devolucao = await devolucaoModel.verificarDevolucaoExistente(venda.id);
            }

            res.render('usuario/minhas-compras', { vendas: vendas });
        } catch (error) {
            console.error('Erro ao buscar compras:', error);
            res.status(500).send('Erro ao carregar suas compras');
        }
    }
}

module.exports = UsuarioController;