
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
                    if(tipoBusca==1)
                        for(let i = 0; i < corpo.lista.length; i++) {
                            let conta = corpo.lista[i];
                            //  onclick="window.location.href='/admin/vendas/detalhes/${conta.id}'"
                            html += `<tr style="cursor: pointer;" onmouseover="this.style.backgroundColor='#f5f5f5'" onmouseout="this.style.backgroundColor=''">
                            <td><strong>#${conta.id}</strong></td>
                            <td>${conta.operacao == 1?'Compra Produtos':'Devolução de Venda'}</td>
                            <td>${conta.operacao == 1? conta.idCompra : conta.idDevoVenda}</td>
                            <td>R$${conta.valor}</td>
                            <td>${new Date(conta.dataVencimento).toLocaleString('pt-BR')}</td>
                            <td>${conta.isPago?'Paga':'Não Paga'}</td>
                            <td><button class = "btn btn-success confirmarPG" data-id="${conta.id}"><i class="bi bi-credit-card"></i>   Realizar Pagamento</button></td>
                            </tr>`;
                        }
                    if(tipoBusca == 2)
                        for(let i = 0; i < corpo.lista.length; i++) {
                            let conta = corpo.lista[i];
                            //  onclick="window.location.href='/admin/vendas/detalhes/${conta.id}'" 
                            html += `<tr style="cursor: pointer;" onmouseover="this.style.backgroundColor='#f5f5f5'" onmouseout="this.style.backgroundColor=''">
                            <td><strong>#${conta.id}</strong></td>
                            <td>${conta.operacao == 1?'Recebimento de Ordem de Serviço': conta.operacao == 2?'Venda de Produtos':'Devolução de Compra'}</td>
                            <td>${conta.operacao == 1? conta.idOS : conta.operação == 2 ? conta.idVenda : conta.idDevoCompra}</td>
                            <td>R$${conta.valor}</td>
                            <td>${new Date(conta.dataVencimento).toLocaleString('pt-BR')}</td>
                            <td>${conta.isPago?'Paga':'Não Paga'}</td>
                            <td><button class = "btn btn-success confirmarRE${conta.isPago?' disabled':''}" data-id="${conta.id}"><i class="bi bi-credit-card"></i>   Confirmar Recebimento</button></td>
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
                    <td colspan="7" class="text-center text-muted py-4">
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
                <td colspan="7" class="text-center text-danger py-4">
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
        alert('Pague');
    }

    let caixa = document.getElementById('caixaStatus');
    let caixaValor = document.getElementById('caixaValor');
    function getCaixa(){
        fetch('/admin/caixa/getStatus')
        .then(function(resposta){
            return resposta.json()
        })
        .then(function(corpo){
            if(corpo.status == 0){
                caixa.textContent = 'Caixa: Fechado';
            }
            if(corpo.status == 1){
                caixa.textContent = 'Caixa: Aberto';
                caixaValor.style.display = 'block';
                caixaValor.textContent = 'Valor: R$'+corpo.valor;
            }
        })
    }
})
