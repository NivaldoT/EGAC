document.addEventListener("DOMContentLoaded", function() {

    corrigirDatasInputs();
    function corrigirDatasInputs(){
        let inputDataInicial = document.getElementById('inputDataInicial');
        inputDataInicial.min = new Date(2025,10,1).toISOString().slice(0,10);
        inputDataInicial.max = new Date().toISOString().slice(0,10);

        let inputDataFinal = document.getElementById('inputDataFinal');
        inputDataFinal.min = new Date(2025,10,1).toISOString().slice(0,10);
        inputDataFinal.max = new Date().toISOString().slice(0,10);
    }

    document.getElementById("buscar").addEventListener("click", carregarPedidos);

    document.getElementById("excel").addEventListener("click", exportarExcel);
    function exportarExcel() {
        var wb = XLSX.utils.table_to_book(document.getElementById("pedidos"));
        XLSX.writeFile(wb, "Relátorio-OS-"+new Date().toLocaleString('pt-br')+".xlsx");
    }

    carregarPedidos();
    function carregarPedidos() {
        let query = "";
        let termo = document.getElementById("inputBusca");
        let filtro = document.getElementById("selectFiltro");
        let marca = document.getElementById("selectMarca");
        let dataInicial = document.getElementById("inputDataInicial");
        let dataFinal = document.getElementById("inputDataFinal");
            query += "?termo=" + termo.value;
        if(filtro.value != "") {
            query += "&filtro=" + filtro.value;
        }
        if(marca.value != "") {
            query += "&marca=" + marca.value;
        }
        if(dataInicial.value != "") {
            query += "&dataInicial=" + dataInicial.value;
        }
        if(dataFinal.value != "") {
            query += "&dataFinal=" + dataFinal.value;
        }

        //faz o fetch para obter a lista de OS
        fetch("/admin/ordemServicos/listar"+query)
        .then(function(resposta) {
            return resposta.json();
        })
        .then(function(corpo) {
            console.log(corpo);
            let html = "";
            if(corpo.lista.length > 0) {
                    for(let i = 0; i < corpo.lista.length; i++) {
                        let OS = corpo.lista[i];
                        //  onclick="window.location.href='/admin/vendas/detalhes/${conta.id}'"
                        html +=`
                        <tr style="cursor: pointer;" onmouseover="this.style.backgroundColor='#f5f5f5'" onmouseout="this.style.backgroundColor=''">
                            <td><strong>#${OS.id}</strong></td>
                            <td>${OS.nomePessoa}</td>
                            <td>${OS.nomeServico}</td>
                            <td>${OS.nomeEqAgricola}</td>
                            <td>${OS.nomeMarca}</td>
                            <td>${OS.nomeFuncionario}</td>
                            <td>${OS.status == 0? 'A Realizar Serviço': OS.status == 1?'Concluída':'Pagamento Recebido'}</td>
                            <td>${OS.comentario? OS.comentario:'Não informado'}</td>
                            <td>${new Date(OS.dataAbertura).toLocaleString('pt-br')}</td>
                            <td>${new Date(OS.dataAgendada).toLocaleDateString('pt-br')}</td>
                            <td>${OS.status == 0?'À Concluir' : new Date(OS.dataConclusao).toLocaleString('pt-br')}</td>
                            <td>
                                <a href="/admin/OrdemServicos/concluir/${OS.id}" class="btn btn-primary ${OS.status!=0? 'disabled':''}"><i class"bi bi-pencil-square"></i>Concluir OS</a>
                                <a href="/admin/OrdemServicos/receber/${OS.id}" class="btn btn-primary ${OS.status!=1?'disabled':''}"><i class"bi bi-pencil-square"></i>Receber OS</a>
                            </td>
                        </tr>`;
                    }
                document.querySelector("#tableOS > tbody").innerHTML = html;

            } 
            else {
                document.querySelector("#tableOS > tbody").innerHTML = `
                <tr>
                <td colspan="12" class="text-center text-muted py-4">
                <i class="bi bi-inbox fs-3 d-block mb-2"></i>
                Nenhuma OS encontrada
                </td>
                </tr>
                `;
            }
        })
        .catch(function(erro) {
            console.error('Erro ao carregar vendas:', erro);
            document.querySelector("#tableOS > tbody").innerHTML = `
            <tr>
            <td colspan="12" class="text-center text-danger py-4">
            <i class="bi bi-exclamation-triangle fs-3 d-block mb-2"></i>
            Erro ao carregar Ordem de Serviços
            </td>
            </tr>
            `;
        });
    
    }
})