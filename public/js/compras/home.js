document.addEventListener("DOMContentLoaded", function() {

    document.getElementById("buscar").addEventListener("click", carregarPedidos);

    carregarPedidos();

    document.getElementById("excel").addEventListener("click", exportarExcel);

    function exportarExcel() {
        var wb = XLSX.utils.table_to_book(document.getElementById("pedidos"));
        XLSX.writeFile(wb, "pedidos-vendas.xlsx");
    }

    window.imprimirPedidos = function() {
        const tbody = document.querySelector("#pedidos > tbody");
        const temDados = tbody && tbody.innerHTML.trim() !== "" && !tbody.innerHTML.includes("Carregando");
        
        if (!temDados) {
            alert("Aguarde o carregamento dos pedidos antes de imprimir.");
            return;
        }
        window.print();
    }

    function carregarPedidos() {
        let query = "";
        let termo = document.getElementById("inputBusca");
        let filtro = document.getElementById("selectFiltro");
        let fornecedor = document.getElementById("selectFornecedor");
        let dataInicial = document.getElementById("inputDataInicial");
        let dataFinal = document.getElementById("inputDataFinal");
            query += "?termo=" + termo.value;
        if(filtro.value != "") {
            query += "&filtro=" + filtro.value;
        }
        if(fornecedor.value != "") {
            query += "&fornecedor=" + fornecedor.value;
        }
        if(dataInicial.value != "") {
            query += "&dataInicial=" + dataInicial.value;
        }
        if(dataFinal.value != "") {
            query += "&dataFinal=" + dataFinal.value;
        }
        //faz o fetch para obter a lista de pedidos
        fetch("/admin/compras/listar" + query)
        .then(function(resposta) {
            return resposta.json();
        })
        .then(function(corpo) {
            console.log(corpo);
            let html = "";
            if(corpo.listaItens.length > 0) {
                for(let i = 0; i < corpo.listaItens.length; i++) {
                    let item = corpo.listaItens[i];
                    let nomeFornecedor;
                    let data;
                    for(let i=0;i<corpo.listaCompra.length;i++){
                        if(corpo.listaCompra[i].id == item.idCompra){
                            nomeFornecedor = corpo.listaCompra[i].nomeFornecedor;
                            data = corpo.listaCompra[i].data;
                            idCompra = corpo.listaCompra[i].id;
                        }
                    }
                    html += `<tr style="cursor: pointer;" onclick="window.location.href='/admin/compras/detalhes/${idCompra}'" onmouseover="this.style.backgroundColor='#f5f5f5'" onmouseout="this.style.backgroundColor=''">
                                <td><strong>#${item.id}</strong></td>
                                <td>${new Date(data).toLocaleString('pt-BR')}</td>
                                <td>${nomeFornecedor}</td>
                                <td>${item.nomeProduto}</td>
                                <td>${item.qtd}</td>
                                <td>R$ ${parseFloat(item.precoUnitario).toFixed(2).replace('.', ',')}</td>
                                <td><strong>R$ ${parseFloat(item.precoUnitario*item.qtd ? item.precoUnitario*item.qtd : 0).toFixed(2).replace('.', ',')}</strong></td>
                                <td><button class="btn btn-sm btn-primary">Efetuar Devolução</button></td>
                            </tr>`;
                }

                document.querySelector("#pedidos > tbody").innerHTML = html;

            } if(corpo.listaItens.length == 0) {
                document.querySelector("#pedidos > tbody").innerHTML = `
                    <tr>
                        <td colspan="8" class="text-center text-muted py-4">
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
                    <td colspan="8" class="text-center text-danger py-4">
                        <i class="bi bi-exclamation-triangle fs-3 d-block mb-2"></i>
                        Erro ao carregar vendas
                    </td>
                </tr>
            `;
        });
    }
})