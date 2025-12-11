document.addEventListener("DOMContentLoaded", function() {

    document.getElementById("buscar").addEventListener("click", carregarPedidos);

    carregarPedidos();

    document.getElementById("excel").addEventListener("click", exportarExcel);

    function exportarExcel() {
        var wb = XLSX.utils.table_to_book(document.getElementById("pedidos"));
        XLSX.writeFile(wb, "pedidos-vendas.xlsx");
    }

    window.imprimirVendas = function() {
        const tbody = document.querySelector("#pedidos > tbody");
        const temDados = tbody && tbody.innerHTML.trim() !== "" && !tbody.innerHTML.includes("Carregando");
        
        if (!temDados) {
            alert("Aguarde o carregamento das vendas antes de imprimir.");
            return;
        }
        window.print();
    }

    function carregarPedidos() {
        let query = "";
        let termo = document.getElementById("inputNumCompra");
        let nomeCliente = document.getElementById("inputNomeCliente");
        let filtro = document.getElementById("selectFiltro");
        let dataInicial = document.getElementById("inputDataInicial");
        let dataFinal = document.getElementById("inputDataFinal");
            query += "?termo=" + termo.value;
        if(nomeCliente.value != "") {
            query += "&nomeCliente=" + nomeCliente.value;
        }
        if(filtro.value != "") {
            query += "&filtro=" + filtro.value;
        }
        if(dataInicial.value != "") {
            query += "&dataInicial=" + dataInicial.value;
        }
        if(dataFinal.value != "") {
            query += "&dataFinal=" + dataFinal.value;
        }
        if(termo.value != "") {
            query = "?termo=" + termo.value;
        }
        //faz o fetch para obter a lista de pedidos
        fetch("/admin/vendas/listar" + query)
        .then(function(resposta) {
            return resposta.json();
        })
        .then(function(corpo) {
            console.log(corpo);
            let html = "";
            if(corpo.lista.length > 0) {
                for(let i = 0; i < corpo.lista.length; i++) {
                    let venda;
                    for(let j=0; j<corpo.listaVendas.length; j++) {
                        if(corpo.lista[i].venda == corpo.listaVendas[j].vendaId){
                            venda = corpo.listaVendas[j];
                        }
                    }
                    let item = corpo.lista[i];
                    html += `<tr style="cursor: pointer;" onclick="window.location.href='/admin/vendas/detalhes/${item.venda}'" onmouseover="this.style.backgroundColor='#f5f5f5'" onmouseout="this.style.backgroundColor=''">
                                <td><strong>#${item.venda}</strong></td>
                                <td>${new Date(item.data).toLocaleString('pt-BR')}</td>
                                <td>${item.cliente || 'N/A'}</td>
                                <td>${item.produto}</td>
                                <td>${item.quantidade}</td>
                                <td>R$ ${parseFloat(item.valorUnitario).toFixed(2).replace('.', ',')}</td>
                                <td><strong>R$ ${parseFloat(venda.vendaValorTotal).toFixed(2).replace('.', ',')}</strong></td>
                                </tr>`;
                            }
                            // <td><strong>R$ ${parseFloat(item.valorTotal ? item.valorTotal : 0).toFixed(2).replace('.', ',')}</strong></td>

                document.querySelector("#pedidos > tbody").innerHTML = html;

            } else {
                document.querySelector("#pedidos > tbody").innerHTML = `
                    <tr>
                        <td colspan="7" class="text-center text-muted py-4">
                            <i class="bi bi-inbox fs-3 d-block mb-2"></i>
                            Nenhuma venda encontrada
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
                        Erro ao carregar vendas
                    </td>
                </tr>
            `;
        });
    }
})
