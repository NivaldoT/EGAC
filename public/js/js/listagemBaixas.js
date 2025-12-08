document.addEventListener('DOMContentLoaded', function() {
    const loading = document.getElementById('loading');
    const tabelaBaixas = document.getElementById('tabelaBaixas');
    const emptyState = document.getElementById('emptyState');
    const corpoTabela = document.getElementById('corpoTabela');
    const btnFiltrar = document.getElementById('btnFiltrar');

    // Carregar baixas ao iniciar
    carregarBaixas();

    // Filtrar ao clicar no botão
    btnFiltrar.addEventListener('click', carregarBaixas);

    // Filtrar ao pressionar Enter nos campos
    document.querySelectorAll('#filtroTermo, #filtroDataInicio, #filtroDataFim').forEach(input => {
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                carregarBaixas();
            }
        });
    });

    async function carregarBaixas() {
        const termo = document.getElementById('filtroTermo').value.trim();
        const dataInicio = document.getElementById('filtroDataInicio').value;
        const dataFim = document.getElementById('filtroDataFim').value;

        // Construir URL com parâmetros
        let url = '/admin/baixa/api/listar?';
        if (termo) url += `termo=${encodeURIComponent(termo)}&`;
        if (dataInicio) url += `dataInicio=${dataInicio}&`;
        if (dataFim) url += `dataFim=${dataFim}&`;

        // Mostrar loading
        loading.style.display = 'block';
        tabelaBaixas.style.display = 'none';
        emptyState.style.display = 'none';

        try {
            const response = await fetch(url);
            const data = await response.json();

            if (data.lista && data.lista.length > 0) {
                renderizarTabela(data.lista);
                tabelaBaixas.style.display = 'table';
            } else {
                emptyState.style.display = 'block';
            }
        } catch (error) {
            console.error('Erro ao carregar baixas:', error);
            emptyState.style.display = 'block';
        } finally {
            loading.style.display = 'none';
        }
    }

    function renderizarTabela(baixas) {
        let html = '';

        baixas.forEach(baixa => {
            const data = new Date(baixa.data);
            const dataFormatada = data.toLocaleDateString('pt-BR') + ' ' + data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

            html += `
                <tr>
                    <td><strong>#${baixa.id}</strong></td>
                    <td>${dataFormatada}</td>
                    <td>${baixa.funcionario || 'N/A'}</td>
                    <td>${baixa.totalItens} ${baixa.totalItens === 1 ? 'item' : 'itens'}</td>
                    <td><strong>R$ ${baixa.valorTotal.toFixed(2)}</strong></td>
                    <td>
                        <a href="/admin/baixa/detalhes/${baixa.id}" class="btn-detalhes">
                            <i class="bi bi-eye"></i> Ver Detalhes
                        </a>
                    </td>
                </tr>
            `;
        });

        corpoTabela.innerHTML = html;
    }
});
