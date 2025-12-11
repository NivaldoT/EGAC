const marcaModel = require('../models/marcaModel');
const categoriaModel = require('../models/categoriaModel');
const produtoModel = require('../models/produtoModel');
const equipAgricolaModel = require ('../models/equipAgricolaModel');
const ServicoModel = require ('../models/servicoModel');
const PedidoModel = require('../models/pedidoModel');
const Database = require('../utils/database');

const PFModel = require('../models/pfisicaModel');
const PJModel = require('../models/pjuridicaModel');
//const FuncionarioModel = require('../models/funcionarioModel');
const pessoaModel = require('../models/pessoaModel');

class adminController {

    homeView(req, res) {
        res.render('admin/adminHome',{layout: 'layout_admin'});
    }
    loginView(req, res) {
        res.render('admin/adminLogin',{layout: 'layout_admin'});
    }
    cadastroView(req, res) {
        res.render('admin/adminCadastro',{layout: 'layout_admin'});
    }
    async listarItemView(req,res){
        let tipoListar = req.params.tipo;

        let listaProdutos = []; //1 = produto, 2 = insumo
        let listaInsumos = [];
        if(tipoListar == 1 || tipoListar == 2){
            let produto = new produtoModel();
            listaProdutos = await produto.listarProd();
            listaInsumos = await produto.listarInsumo();
        }

        let listaServicos = []; //3 = serviço
        if(tipoListar == 3){
            let Servicos = new ServicoModel();
            listaServicos = await Servicos.listar();
        }

        let listaEqAg = []; //4 = equipamento agrícola
        if(tipoListar == 4){
            let eqag = new equipAgricolaModel();
            listaEqAg = await eqag.listar();
        }

        let listaMarcas = [];   //5 = marca
        if(tipoListar == 5){
            let marca = new marcaModel();
            listaMarcas = await marca.listar();
        }

        let listaCategorias = []; //6 = categoria
        if(tipoListar == 6){
            let categoria = new categoriaModel();
            listaCategorias = await categoria.listar();
        }

        

    res.render('admin/listagem',{listaMarcas: listaMarcas, listaProdutos: listaProdutos,listaInsumos: listaInsumos, listaEqAg: listaEqAg, listaCategorias: listaCategorias, listaServicos: listaServicos,tipoListar: tipoListar, layout: 'layout_admin'});
    }
    async alterarItemView(req,res){

        let id = req.params.id;
        let tipo = req.params.tipo;

        let prod;
        if(tipo == 1 || tipo == 2){
            prod = new produtoModel();
            prod = await prod.buscarId(id)
        }
        if(tipo == 3){
            prod = new ServicoModel();
            prod = await prod.buscarId(id)
        }
        if(tipo == 4){
            prod = new equipAgricolaModel();
            prod = await prod.buscarId(id)
        }

        if(tipo == 5){
            prod = new marcaModel();
            prod = await prod.buscarId(id);
        }
        
        if(tipo == 6){
            prod = new categoriaModel();
            prod = await prod.buscarId(id);
        }
        
        let listaMarcas = [];
        let marca = new marcaModel();
        listaMarcas = await marca.listar();
        
        let listaCategorias = [];
        let categoria = new categoriaModel();
        listaCategorias = await categoria.listar();
    res.render('admin/alterarItem', {prod: prod, tipo: tipo,listaMarcas: listaMarcas, listaCategorias: listaCategorias, layout: 'layout_admin'});
    }
    async excluirItem(req,res){
        try {
            let tipo = req.body.obj.tipo;
            let id = req.body.obj.id;

            let prod;
            if(tipo == 1 || tipo == 2){
                prod = new produtoModel();
                
                // Verificar se o produto está em vendas, devoluções ou OS
                let db = new Database();
                let checkVendas = await db.ExecutaComando('SELECT COUNT(*) as total FROM tb_ItemVenda WHERE itven_idProduto = ?', [id]);
                let checkDevolucoes = await db.ExecutaComando('SELECT COUNT(*) as total FROM tb_ItemDevoVenda WHERE itdevo_idProd = ?', [id]);
                let checkOS = await db.ExecutaComando('SELECT COUNT(*) as total FROM tb_ItensUsadosOS WHERE itos_idProd = ?', [id]);
                
                let totalVendas = checkVendas[0].total;
                let totalDevolucoes = checkDevolucoes[0].total;
                let totalOS = checkOS[0].total;
                
                if(totalVendas > 0 || totalDevolucoes > 0 || totalOS > 0){
                    let msg = 'Não é possível excluir este ' + (tipo == 1 ? 'produto' : 'insumo') + '! Ele está vinculado a: ';
                    let vinculos = [];
                    if(totalVendas > 0) vinculos.push(totalVendas + ' venda(s)');
                    if(totalDevolucoes > 0) vinculos.push(totalDevolucoes + ' devolução(ões)');
                    if(totalOS > 0) vinculos.push(totalOS + ' ordem(ns) de serviço');
                    msg += vinculos.join(', ') + '.';
                    res.send({ok: false, msg: msg});
                    return;
                }
                
                let result = await prod.excluir(id);
                if(result)
                    res.send({ok: true , msg: (tipo == 1 ? 'Produto' : 'Insumo') + ' Excluído com Sucesso!'});
                else
                    res.send({ok: false, msg: 'Falha na Exclusão do ' + (tipo == 1 ? 'Produto' : 'Insumo') + '!'});
            }
        if(tipo == 3){
            prod = new ServicoModel();
            let result = await prod.excluir(id);
            if(result)
                res.send({ok: true , msg: 'Serviço Excluido com Sucesso!'});
            else
                res.send({ok: false, msg: 'Falha na Exclusão do Serviço!'});
        }
        if(tipo == 4){
            prod = new equipAgricolaModel(id);
            let temOS = await prod.verificarTemOS();
            if(temOS > 0){
                res.send({ok: false, msg: 'Não é possível excluir este equipamento agrícola! Existem ' + temOS + ' ordem(s) de serviço vinculada(s) a ele.'});
                return;
            }
            let result = await prod.excluir(id);
            if(result)
                res.send({ok: true , msg: 'Equipamento Agrícola Excluido com Sucesso!'});
            else
                res.send({ok: false, msg: 'Falha na Exclusão do Equipamento Agrícola!'});
        }
        if(tipo == 5){
            let ok = true;
            let msg;
            prod = new marcaModel(id);

            let childs = await prod.verificarChild()
            if(childs > 0){
                ok = false;
                msg = 'Não é possível excluir esta marca! Existem ' + childs + ' produto(s) vinculado(s) a ela.';
            }

            if(ok){
                let result = await prod.excluir(id);
                if(result){ok = true; msg = 'Marca Excluida com Sucesso!'}
                else{ok = false; msg = 'Falha na Exclusão da Marca!'};
            }
            res.send({ok,msg})
        }
        
        if(tipo == 6){
            let categoria = new categoriaModel(id, null);
            
            // Verificar se há produtos vinculados
            const temProdutos = await categoria.verificarProdutos();
            console.log(`Categoria ID ${id}: ${temProdutos} produtos vinculados`);
            if(temProdutos > 0){
                res.send({ok: false, msg: `Não é possível excluir esta categoria! Existem ${temProdutos} produto(s) vinculado(s) a ela.`});
                return;
            }

            // Verificar se há equipamentos vinculados
            const temEquipamentos = await categoria.verificarEquipamentos();
            console.log(`Categoria ID ${id}: ${temEquipamentos} equipamentos vinculados`);
            if(temEquipamentos > 0){
                res.send({ok: false, msg: `Não é possível excluir esta categoria! Existem ${temEquipamentos} equipamento(s) agrícola(s) vinculado(s) a ela.`});
                return;
            }
            
            let result = await categoria.excluir(id);
            if(result)
                res.send({ok: true , msg: 'Categoria Excluida com Sucesso!'});
            else
                res.send({ok: false, msg: 'Falha na Exclusão da Categoria!'});
        }
        } catch (error) {
            console.error('Erro ao excluir item:', error);
            res.send({ok: false, msg: 'Erro ao excluir: ' + error.message});
        }
    }

    async clientesView(req,res){
        const tipo = req.params.tipo || 'pf'; // pf, pj ou funcionarios
        
        let listaPF = [];
        let pf = new PFModel();
        listaPF = await pf.listar();
        
        let listaPJ = [];
        let pj = new PJModel();
        listaPJ = await pj.listar();
        
        res.render('admin/adminClientes',{layout: 'layout_admin', listaPF: listaPF, listaPJ: listaPJ, tipoSelecionado: tipo});
    }
    PFCadastroView(req,res){
        res.render('admin/PFCadastro',{layout: 'layout_admin'});
    }
    PJCadastroView(req,res){
        res.render('admin/PJCadastro',{layout: 'layout_admin'});
    }
    FuncionarioCadastroView(req,res){
        res.render('admin/FuncionarioCadastro',{layout: 'layout_admin'});
    }

    async excluirCliente(req,res){
        let ok = true;
        let msg; 
        let id = req.body.obj.id;
        let pessoa = new pessoaModel(id);
        pessoa = await pessoa.buscarPorId(id);

        let Vendeu = await pessoa.verificarVendas();        //verifica se o cliente tem vendas ou OS
        if(Vendeu > 0){
            ok = false;
            msg = 'Não é possível excluir este Cliente! Ele possui registros de vendas ou Ordem de Serviço dele no sistema.';
        }

        let pessoaAux;
        if(pessoa.tipo == 1){
            pessoaAux = new PFModel(id);
            pessoaAux = await pessoaAux.buscarId();
            
            if(pessoaAux.isFunc){
                let Trabalhou = await pessoaAux.verificarTrabalho();    //verifica se o funcionario tem registros de trabalho
                if(Trabalhou > 0){
                    ok = false;
                    msg = 'Não é possível excluir este Funcionario! Ele possui registros de trabalho no sistema.';
                }
            }
        }

        if(pessoa.tipo == 2){
            pessoaAux = new PJModel(id);
            pessoaAux = await pessoaAux.buscarId();

            let Comprou = await pessoaAux.verificarCompras();   //verifica se já compramos deste fornecedor
            if(Comprou > 0){
                ok = false;
                msg = 'Não é possível excluir este Fornecedor! Possuimos registros de compras que fizemos com ele no sistema.';
            }
        }
        
        if(ok){
            let result = await pessoa.excluir();
            if(result){
                ok = true;
                msg = 'Exclusão concluída com Sucesso!';
            }
            else{
                ok = false;
                msg = 'Falha na Exclusão do Cliente!';
            }
        }
        res.send({ok,msg});
    }

    async alterarClienteView(req,res){
        let id = req.params.id;
        let tipo = req.params.tipo;

        let cliente;
        if(tipo == 1){
            cliente = new PFModel(id);
            cliente = await cliente.buscarId();
        }
        if(tipo == 2){
            cliente = new PJModel(id);
            cliente = await cliente.buscarId();
        }
    res.render('admin/alterarCliente', {layout: 'layout_admin', cliente: cliente});
    }

    // MÉTODOS DO DASHBOARD
    async dashboardResumo(req, res) {
        try {
            const banco = new Database();
            
            // Total de vendas do mês
            const sqlVendas = `
                SELECT COALESCE(SUM(ven_valorTotal), 0) as total 
                FROM tb_Venda 
                WHERE MONTH(ven_data) = MONTH(CURDATE()) 
                AND YEAR(ven_data) = YEAR(CURDATE())
            `;
            const vendas = await banco.ExecutaComando(sqlVendas);
            console.log('Vendas:', vendas);
            
            // Total de clientes ativos
            const sqlClientes = `SELECT COUNT(*) as total FROM tb_Pessoa WHERE pessoa_tipo IN (1, 2)`;
            const clientes = await banco.ExecutaComando(sqlClientes);
            console.log('Clientes:', clientes);
            
            // Produtos com estoque baixo (menos de 4 unidades)
            const sqlEstoque = `SELECT COUNT(*) as total FROM tb_Produto WHERE prod_estoque < 4 AND prod_estoque > 0`;
            const estoque = await banco.ExecutaComando(sqlEstoque);
            console.log('Estoque:', estoque);
            
            const resultado = {
                totalVendas: parseFloat(vendas[0].total) || 0,
                totalClientes: parseInt(clientes[0].total) || 0,
                produtosBaixo: parseInt(estoque[0].total) || 0
            };
            
            console.log('Resultado final:', resultado);
            res.json(resultado);
        } catch (error) {
            console.error('Erro ao buscar resumo:', error);
            res.status(500).json({ totalVendas: 0, totalClientes: 0, produtosBaixo: 0 });
        }
    }

    async dashboardVendas(req, res) {
        try {
            const periodo = req.query.periodo || 'dia';
            const banco = new Database();
            let sql = '';
            let labels = [];
            let valores = [];
            
            if (periodo === 'dia') {
                // Vendas por hora do dia atual
                sql = `
                    SELECT HOUR(ven_data) as periodo, COALESCE(SUM(ven_valorTotal), 0) as total
                    FROM tb_Venda
                    WHERE DATE(ven_data) = CURDATE()
                    GROUP BY HOUR(ven_data)
                    ORDER BY periodo
                `;
                const resultado = await banco.ExecutaComando(sql);
                
                // Preencher todas as horas do dia
                for(let i = 0; i < 24; i++) {
                    labels.push(i + 'h');
                    const venda = resultado.find(r => r.periodo === i);
                    valores.push(venda ? parseFloat(venda.total) : 0);
                }
            } else if (periodo === 'mes') {
                // Vendas por dia do mês atual
                sql = `
                    SELECT DAY(ven_data) as periodo, COALESCE(SUM(ven_valorTotal), 0) as total
                    FROM tb_Venda
                    WHERE MONTH(ven_data) = MONTH(CURDATE()) AND YEAR(ven_data) = YEAR(CURDATE())
                    GROUP BY DAY(ven_data)
                    ORDER BY periodo
                `;
                const resultado = await banco.ExecutaComando(sql);
                const diasNoMes = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
                
                for(let i = 1; i <= diasNoMes; i++) {
                    labels.push('Dia ' + i);
                    const venda = resultado.find(r => r.periodo === i);
                    valores.push(venda ? parseFloat(venda.total) : 0);
                }
            } else if (periodo === 'ano') {
                // Vendas por mês do ano atual
                sql = `
                    SELECT MONTH(ven_data) as periodo, COALESCE(SUM(ven_valorTotal), 0) as total
                    FROM tb_Venda
                    WHERE YEAR(ven_data) = YEAR(CURDATE())
                    GROUP BY MONTH(ven_data)
                    ORDER BY periodo
                `;
                const resultado = await banco.ExecutaComando(sql);
                const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
                
                for(let i = 1; i <= 12; i++) {
                    labels.push(meses[i-1]);
                    const venda = resultado.find(r => r.periodo === i);
                    valores.push(venda ? parseFloat(venda.total) : 0);
                }
            }
            
            res.json({ labels, valores });
        } catch (error) {
            console.error('Erro ao buscar vendas:', error);
            res.json({ labels: [], valores: [] });
        }
    }

    async dashboardAlertasEstoque(req, res) {
        try {
            const banco = new Database();
            
            // Produtos com estoque baixo (menos de 4 unidades)
            const sql = `
                SELECT prod_id, prod_nome as nome, prod_estoque as estoque
                FROM tb_Produto
                WHERE prod_estoque < 4 AND prod_estoque > 0
                ORDER BY prod_estoque ASC
                LIMIT 10
            `;
            
            const produtos = await banco.ExecutaComando(sql);
            res.json(produtos);
        } catch (error) {
            console.error('Erro ao buscar alertas de estoque:', error);
            res.json([]);
        }
    }
}

module.exports = adminController;