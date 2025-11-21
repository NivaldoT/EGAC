document.addEventListener("DOMContentLoaded", function() {

    document.getElementById("buscar").addEventListener("click", carregarPedidos);

    carregarPedidos();

    document.getElementById("excel").addEventListener("click", exportarExcel);

    function exportarExcel() {
        var wb = XLSX.utils.table_to_book(document.getElementById("pedidos"));
        XLSX.writeFile(wb, "pedidos-vendas.xlsx");
    }

    function carregarPedidos() {
        let query = "";
        let termo = document.getElementById("inputBusca");
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
                    let item = corpo.lista[i];
                    html += `<tr>
                                <td><strong>#${item.venda}</strong></td>
                                <td>${new Date(item.data).toLocaleString('pt-BR')}</td>
                                <td>${item.cliente || 'N/A'}</td>
                                <td>${item.produto}</td>
                                <td>${item.quantidade}</td>
                                <td>R$ ${parseFloat(item.valorUnitario).toFixed(2).replace('.', ',')}</td>
                                <td><strong>R$ ${parseFloat(item.valorTotal ? item.valorTotal : 0).toFixed(2).replace('.', ',')}</strong></td>
                            </tr>`;
                }

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
