document.addEventListener('DOMContentLoaded', function() {
    const produtoBusca = document.getElementById('produtoBusca');
    const autocompleteResults = document.getElementById('autocompleteResults');
    const formAdicionar = document.getElementById('formAdicionar');
    const btnAdicionar = document.getElementById('btnAdicionar');
    const btnFinalizarBaixa = document.getElementById('btnFinalizarBaixa');
    const cardItens = document.getElementById('cardItens');
    const tabelaItens = document.getElementById('tabelaItens');
    
    let itensBaixa = [];
    let debounceTimer;

    // Autocomplete de produtos
    produtoBusca.addEventListener('input', function() {
        clearTimeout(debounceTimer);
        const termo = this.value.trim();

        if (termo.length < 2) {
            autocompleteResults.style.display = 'none';
            return;
        }

        debounceTimer = setTimeout(() => {
            fetch(`/admin/baixa/buscarProdutos?termo=${encodeURIComponent(termo)}`)
                .then(res => res.json())
                .then(produtos => {
                    if (produtos.length === 0) {
                        autocompleteResults.innerHTML = '<div class="autocomplete-item">Nenhum produto encontrado</div>';
                        autocompleteResults.style.display = 'block';
                        return;
                    }

                    let html = '';
                    produtos.forEach(produto => {
                        const tipoNome = produto.tipo === 1 ? 'Produto' : 'Insumo';
                        html += `
                            <div class="autocomplete-item" data-id="${produto.id}" data-nome="${produto.nome}" 
                                 data-preco="${produto.preco}" data-estoque="${produto.estoque}">
                                <div class="autocomplete-item-name">${produto.nome}</div>
                                <div class="autocomplete-item-info">
                                    ${tipoNome} | Estoque: ${produto.estoque} un | R$ ${parseFloat(produto.preco).toFixed(2)}
                                </div>
                            </div>
                        `;
                    });
                    autocompleteResults.innerHTML = html;
                    autocompleteResults.style.display = 'block';

                    // Adicionar evento de clique nos itens
                    document.querySelectorAll('.autocomplete-item').forEach(item => {
                        item.addEventListener('click', function() {
                            const id = this.dataset.id;
                            if (!id) return;

                            document.getElementById('produtoId').value = id;
                            document.getElementById('produtoNome').value = this.dataset.nome;
                            document.getElementById('produtoPreco').value = this.dataset.preco;
                            document.getElementById('produtoEstoque').value = this.dataset.estoque + ' un';
                            
                            produtoBusca.value = this.dataset.nome;
                            autocompleteResults.style.display = 'none';
                            formAdicionar.style.display = 'block';
                            document.getElementById('quantidade').focus();
                        });
                    });
                })
                .catch(error => {
                    console.error('Erro ao buscar produtos:', error);
                });
        }, 300);
    });

    // Fechar autocomplete ao clicar fora
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.autocomplete-container')) {
            autocompleteResults.style.display = 'none';
        }
    });

    // Adicionar item à lista
    btnAdicionar.addEventListener('click', function() {
        console.log('Botão adicionar clicado');
        
        const id = document.getElementById('produtoId').value;
        const nome = document.getElementById('produtoNome').value;
        const preco = parseFloat(document.getElementById('produtoPreco').value);
        const estoqueDisp = parseInt(document.getElementById('produtoEstoque').value);
        const quantidade = parseInt(document.getElementById('quantidade').value);
        const motivo = document.getElementById('motivo').value;

        console.log('Dados do item:', { id, nome, preco, estoqueDisp, quantidade, motivo });

        // Validações
        if (!id || !quantidade || quantidade <= 0) {
            mostrarToast('Atenção', 'Informe uma quantidade válida', 'error');
            return;
        }

        if (quantidade > estoqueDisp) {
            mostrarToast('Erro', 'Estoque insuficiente! Disponível: ' + estoqueDisp + ' un', 'error');
            return;
        }

        // Verificar se produto já foi adicionado
        const jaAdicionado = itensBaixa.find(item => item.idProduto === parseInt(id));
        if (jaAdicionado) {
            mostrarToast('Atenção', 'Produto já adicionado à lista', 'error');
            return;
        }

        // Adicionar à lista
        itensBaixa.push({
            idProduto: parseInt(id),
            nome: nome,
            quantidade: quantidade,
            valorUnitario: preco,
            motivo: motivo
        });

        console.log('Item adicionado. Lista atual:', itensBaixa);

        atualizarTabela();
        limparFormulario();
        mostrarToast('Sucesso', 'Item adicionado à baixa', 'success');
    });

    // Atualizar tabela de itens
    function atualizarTabela() {
        if (itensBaixa.length === 0) {
            cardItens.style.display = 'none';
            btnFinalizarBaixa.disabled = true;
            return;
        }

        cardItens.style.display = 'block';
        btnFinalizarBaixa.disabled = false;

        let html = '';
        let valorTotal = 0;

        itensBaixa.forEach((item, index) => {
            const valorItem = item.quantidade * item.valorUnitario;
            valorTotal += valorItem;

            html += `
                <tr>
                    <td>${item.nome}</td>
                    <td>${item.quantidade} un</td>
                    <td>R$ ${item.valorUnitario.toFixed(2)}</td>
                    <td>R$ ${valorItem.toFixed(2)}</td>
                    <td>${item.motivo}</td>
                    <td>
                        <button class="btn-remove" onclick="removerItem(${index})">
                            <i class="bi bi-trash"></i>
                        </button>
                    </td>
                </tr>
            `;
        });

        tabelaItens.innerHTML = html;
        document.getElementById('valorTotalBaixa').textContent = valorTotal.toFixed(2);
    }

    // Remover item da lista (função global)
    window.removerItem = function(index) {
        itensBaixa.splice(index, 1);
        atualizarTabela();
        showToast('Sucesso', 'Item removido', 'success');
    };

    // Limpar formulário
    function limparFormulario() {
        produtoBusca.value = '';
        document.getElementById('produtoId').value = '';
        document.getElementById('produtoNome').value = '';
        document.getElementById('produtoPreco').value = '';
        document.getElementById('produtoEstoque').value = '';
        document.getElementById('quantidade').value = '1';
        document.getElementById('motivo').value = 'Perda por vencimento';
        formAdicionar.style.display = 'none';
    }

    // Finalizar baixa
    btnFinalizarBaixa.addEventListener('click', async function() {
        console.log('Botão finalizar clicado');
        console.log('Itens na baixa:', itensBaixa);
        
        if (itensBaixa.length === 0) {
            mostrarToast('Atenção', 'Adicione ao menos um item', 'error');
            return;
        }

        // Calcular estoque total atual e quantidade total a ser baixada
        const estoqueAtual = itensBaixa.reduce((total, item) => total + item.estoque, 0);
        const quantidadeTotal = itensBaixa.reduce((total, item) => total + item.quantidade, 0);

        mostrarModal(
            'Confirmar Baixa de Estoque', 
            'Você está removendo itens do estoque',
            estoqueAtual,
            quantidadeTotal,
            function() {
                finalizarBaixaEstoque();
            }
        );
    });

    async function finalizarBaixaEstoque() {
        btnFinalizarBaixa.disabled = true;
        btnFinalizarBaixa.innerHTML = '<i class="bi bi-hourglass-split"></i> Processando...';

        console.log('Enviando dados:', { itens: itensBaixa });

        try {
            const response = await fetch('/admin/baixa/gravar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    itens: itensBaixa
                })
            });

            console.log('Response status:', response.status);
            const resultado = await response.json();
            console.log('Resultado:', resultado);

            if (resultado.ok) {
                mostrarToast('Sucesso', 'Baixa de estoque registrada com sucesso!', 'success');
                setTimeout(() => {
                    window.location.href = '/admin/baixa/listar';
                }, 1500);
            } else {
                mostrarToast('Erro', resultado.msg, 'error');
                btnFinalizarBaixa.disabled = false;
                btnFinalizarBaixa.innerHTML = '<i class="bi bi-check-lg"></i> Finalizar Baixa';
            }
        } catch (error) {
            console.error('Erro ao finalizar baixa:', error);
            mostrarToast('Erro', 'Erro ao processar baixa de estoque', 'error');
            btnFinalizarBaixa.disabled = false;
            btnFinalizarBaixa.innerHTML = '<i class="bi bi-check-lg"></i> Finalizar Baixa';
        }
    }
});
