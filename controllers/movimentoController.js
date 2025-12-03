const CaixaModel = require('../models/caixaModel');
const MovimentoModel = require('../models/movimentoModel');

// exports.registrarMovimento = async (req, res) => {
//     const { operacao, valor, tipo, obs } = req.body;
//     const idFunc = req.session.funcionarioId || req.cookies.FuncionarioId;
//     const idCaixa = req.session.caixaId || req.cookies.CaixaId;
//     let movModel = new MovimentoModel();
//     let ok = await movModel.registrar(operacao, idCaixa, valor, idFunc, tipo, obs);
//     res.json({ ok, msg: ok ? 'Movimento registrado!' : 'Erro ao registrar' });
// };

class MovimentoController{
    async registrarMovimento(req,res){
        const { operacao, valor, tipo, obs } = req.body;
        const idFunc = req.session.funcionarioId || req.cookies.FuncionarioId;
        const idCaixa = req.session.caixaId || req.cookies.CaixaId;
        let movModel = new MovimentoModel();
        let ok = await movModel.registrar(operacao, idCaixa, valor, idFunc, tipo, obs);
        res.json({ ok, msg: ok ? 'Movimento registrado!' : 'Erro ao registrar' });
    }

    async buscarDeCaixa(req,res){
        let idCaixa = req.params.idCaixa;

        let movimentos = new MovimentoModel(null,null,null,null,null,idCaixa);
        let lista = await movimentos.listarPorCaixa();

        res.send({lista});
    }
}
module.exports = MovimentoController;