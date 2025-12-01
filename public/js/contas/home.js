
document.addEventListener("DOMContentLoaded", function() {

    document.getElementById("buscar").addEventListener("click", carregarPedidos);

    let selectTipoBusca = document.getElementById('selectContaval');
    selectTipoBusca.addEventListener('change', carregarPedidos);
    carregarPedidos();

    document.getElementById("excel").addEventListener("click", exportarExcel);
    function exportarExcel() {
        var wb = XLSX.utils.table_to_book(document.getElementById("pedidos"));
        XLSX.writeFile(wb, "pedidos-vendas.xlsx");
    }

    let btnsRE = [];
    let btnsPG = [];
    function carregarPedidos() {
        let query = "";
        let tipoBusca = selectTipoBusca.value;
        if(tipoBusca!=0){
            let termo = document.getElementById("inputBusca");
            if(termo.value != "") {
                query = "&termo=" + termo.value;
            }
            //faz o fetch para obter a lista de pedidos
            fetch("/admin/contas/listar?tipoBusca="+tipoBusca+query)
            .then(function(resposta) {
                return resposta.json();
            })
            .then(function(corpo) {
                console.log(corpo);
                let html = "";
                if(corpo.lista.length > 0) {
                    if(tipoBusca==1) // CONTAS A PAGAR
                        for(let i = 0; i < corpo.lista.length; i++) {
                            let conta = corpo.lista[i];
                            //  onclick="window.location.href='/admin/vendas/detalhes/${conta.id}'"
                            html += `<tr style="cursor: pointer;" onmouseover="this.style.backgroundColor='#f5f5f5'" onmouseout="this.style.backgroundColor=''">
                            <td><strong>#${conta.id}</strong></td>
                            <td>${conta.operacao == 1?'Compra Produtos':'Devolução de Venda'}</td>
                            <td>${conta.operacao == 1? conta.idCompra : conta.idDevoVenda}</td>
                            <td>R$${conta.valor}</td>
                            <td>${new Date(conta.dataVencimento).toLocaleDateString('pt-BR')}</td>
                            <td>${conta.isPago?'Paga':'Não Paga'}</td>
                            <td><button class = "btn btn-success confirmarPG ${conta.isPago?'disabled':''}" data-id="${conta.id}"><i class="bi bi-credit-card"></i>   Realizar Pagamento</button></td>
                            </tr>`;
                        }
                    if(tipoBusca == 2) // CONTAS A RECEBER
                        for(let i = 0; i < corpo.lista.length; i++) {
                            let conta = corpo.lista[i];
                            //  onclick="window.location.href='/admin/vendas/detalhes/${conta.id}'" 
                            html += `<tr style="cursor: pointer;" onmouseover="this.style.backgroundColor='#f5f5f5'" onmouseout="this.style.backgroundColor=''">
                            <td><strong>#${conta.id}</strong></td>
                            <td>${conta.operacao == 1?'Recebimento de Ordem de Serviço': conta.operacao == 2?'Venda de Produtos':'Devolução de Compra'}</td>
                            <td>${conta.operacao == 1? conta.idOS : conta.operação == 2 ? conta.idVenda : conta.idDevoCompra}</td>
                            <td>R$${conta.valor}</td>
                            <td>${new Date(conta.dataVencimento).toLocaleDateString('pt-BR')}</td>
                            <td>${conta.isPago?'Paga':'Não Paga'}</td>
                            <td><button class = "btn btn-success confirmarRE ${conta.isPago?'disabled':''}" data-id="${conta.id}"><i class="bi bi-credit-card"></i>   Confirmar Recebimento</button></td>
                            </tr>`;
                        }
                    document.querySelector("#pedidos > tbody").innerHTML = html;
                    btnsPG = document.querySelectorAll('.confirmarPG');
                    btnsRE = document.querySelectorAll('.confirmarRE');
                    for(let i=0;i<btnsRE.length;i++){btnsRE[i].addEventListener('click', Receber)}
                    for(let i=0;i<btnsPG.length;i++){btnsPG[i].addEventListener('click', Pagar)}

                } 
                else {
                    document.querySelector("#pedidos > tbody").innerHTML = `
                    <tr>
                    <td colspan="8" class="text-center text-muted py-4">
                    <i class="bi bi-inbox fs-3 d-block mb-2"></i>
                    Nenhuma conta encontrada
                    </td>
                    </tr>
                    `;
                }
            })
            .catch(function(erro) {
                console.error('Erro ao carregar vendas:', erro);
                document.querySelector("#pedidos > tbody").innerHTML = `
                <tr>
                <td colspan="8" class="text-center text-danger py-4">
                <i class="bi bi-exclamation-triangle fs-3 d-block mb-2"></i>
                Erro ao carregar contas
                </td>
                </tr>
                `;
            });
        }
    }
    function Receber(){
        let id = {id : this.dataset.id};
        if(confirm('Confirma o Recebimento da Conta ID: '+id.id+'?')){
            fetch('/admin/contas/receber',{
                method: 'POST',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(id)
            })
            .then(function(resposta) {
                return resposta.json();
            })
            .then(function(corpo) {
                alert(corpo.msg);
                carregarPedidos();
                getCaixa();
            })
        }
    }

    function Pagar(){
        let id = {id: this.dataset.id};
        if(confirm('Confirma o Pagamento da Conta ID: '+id.id+'?')){
            fetch('/admin/contas/pagar',{
                method:'POST',
                headers:{
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(id)
            })
            .then(function(resposta){
                return resposta.json();
            })
            .then(function(corpo){
                alert(corpo.ok+corpo.msg);
                carregarPedidos();
                getCaixa();
            })
        }
    }

    let caixa = document.getElementById('caixaStatus');
    let caixaValor = document.getElementById('caixaValor');
    function getCaixa(){
        fetch('/admin/caixa/getStatus')     //VERIFICA SE O FUNCIONARIO TEM UM CAIXA ABERTO E TRAZ ESTE CAIXA COMO OBJ
        .then(function(resposta){
            return resposta.json()
        })
        .then(function(corpo){
            let caixaModel = corpo.caixa;
            let htmlAlert;       //Caixa de Status do caixa modal
            if(caixaModel.status == 0){
                htmlAlert = `<div class='alert alert-warning'>Nenhum caixa aberto</div>`;
                caixa.textContent = 'Caixa: Fechado';
                caixaModal.innerHTML = `<h5>Abrir Caixa</h5>
                                        <div class="form-floating">
                                            <input type="number" name="valorInicialCaixa" class="form-control" placeholder=" " required id="valorInicialCaixa">
                                            <label>Valor Inicial</label>
                                        </div>`;
                let inputCaixaValor = document.getElementById('valorInicialCaixa');
                inputCaixaValor.addEventListener('keypress', validarInicialCaixa);

                acaoBtnCaixa.addEventListener('click', abrirCaixa);         //MUDA O BOTÃO DE AÇÃO DO MODAL
                acaoBtnCaixa.classList = 'btn btn-success';
                acaoBtnCaixa.textContent = 'Abrir Caixa';
                acaoBtnCaixa.removeEventListener('click', fecharCaixa);

                caixaValor.textContent = 'Valor: R$00,00';

                document.getElementById('exportarCaixa').style.display = 'none';  //ESCONDE BOTÃO EXPORTAR CAIXA

                document.getElementById('statusCaixa').innerHTML = htmlAlert;
            }
            if(caixaModel.status == 1){
                fetch('/admin/movimentos/buscarDeCaixa/'+caixaModel.id)     //BUSCA OS MOVIMENTOS DO CAIXA ABERTO PELO IDCAIXA
                .then(function(resposta){
                    return resposta.json()
                })
                .then(function(corpo){
                    document.getElementById('nomeCaixaSpan').textContent = 'Funcionário Responsável: '+caixaModel.nomeFunc;
                    document.getElementById('dataCaixaSpan').textContent = 'Data e Hora de Abertura: '+new Date(caixaModel.dataAbertura).toLocaleString('pt-br');
                    let listaMovimentos = corpo.lista;
                    let tbody = '';
                    if(listaMovimentos.length>0){
                        for(let i=0; i<listaMovimentos.length;i++){
                            tbody += `
                                <tr>
                                    <td>${listaMovimentos[i].id}</td>
                                    <td>${listaMovimentos[i].operacao == 1 ? 'Conta a Pagar':'Conta a Receber'}</td>
                                    <td>${listaMovimentos[i].operacao == 1? listaMovimentos[i].idContaPagar: listaMovimentos[i].idContaReceber}</td>
                                    <td>R$${(listaMovimentos[i].valor).toFixed(2)}</td>
                                    <td>${new Date(listaMovimentos[i].data).toLocaleDateString('pt-br')+' / '+new Date(listaMovimentos[i].data).toLocaleTimeString('pt-br')}</td>
                                </tr>` 
                        }
                    }
                    htmlAlert = `<div class='alert alert-success'>Caixa aberto - Valor atual: R$${Number((caixaModel.valor)).toFixed(2)}</div>`;
                    caixa.textContent = 'Caixa: Aberto';
                    caixaModal.innerHTML = `
                        <div class="table-responsive">
                            <table id="movimentosCaixa" class="table table-hover table-striped">
                            <h5>Movimentos deste Caixa</h5>
                                <thead class="table-light">
                                    <tr>
                                        <th>Movimento ID</th>
                                        <th>Operação</th>
                                        <th>ID Operação</th>
                                        <th>Valor</th>
                                        <th>Data e Horário</th>
                                    </tr>
                                </thead>
                                <tbody>${tbody}</tbody>
                            </table>
                        </div>`;

                    caixaValor.style.display = 'block';
                    caixaValor.textContent = 'Valor: R$'+caixaModel.valor;

                    acaoBtnCaixa.addEventListener('click', fecharCaixa);
                    acaoBtnCaixa.classList = 'btn btn-danger';
                    acaoBtnCaixa.textContent = 'Fechar Caixa';
                    acaoBtnCaixa.removeEventListener('click', abrirCaixa);

                    document.getElementById('exportarCaixa').style.display = 'inline-flex';   //MOSTRA BOTÃO EXPORTAR CAIXA

                    document.getElementById('modalDialog').classList.add('modal-xl'); // AUMENTA O TAMANHO DO MODAL
                    document.getElementById('statusCaixa').innerHTML = htmlAlert;
                })
            }

        })
    }
})
