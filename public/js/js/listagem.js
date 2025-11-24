document.addEventListener('DOMContentLoaded', function(){
    const select = document.getElementById('select');
    
    change();
    select.addEventListener('change', change);

    function change(){    
        let listas = document.querySelectorAll('.row[id], table[id]');            // SELECIONA A LISTA A EXIBIR
        for(let i=0; i< listas.length; i++){
            if(listas[i].id == select.value)
                listas[i].style.display = listas[i].tagName === 'TABLE' ? 'table' : 'flex';
            else
                listas[i].style.display = 'none';
        }
    }

    const btnExcluir = document.querySelectorAll('.btnExcluir');
    for(let i=0;i<btnExcluir.length;i++)
        btnExcluir[i].addEventListener('click',excluir);
    
    const btnAumentar = document.querySelectorAll('.btnAumentarEstoque');
    for(let i=0; i<btnAumentar.length; i++)
        btnAumentar[i].addEventListener('click', aumentarEstoque);

    const btnDiminuir = document.querySelectorAll('.btnDiminuirEstoque');
    for(let i=0; i<btnDiminuir.length; i++)
        btnDiminuir[i].addEventListener('click', diminuirEstoque);

    const inputsEstoque = document.querySelectorAll('.inputEstoque');
    for(let i=0; i<inputsEstoque.length; i++)
        inputsEstoque[i].addEventListener('change', alterarEstoqueManual);

    function aumentarEstoque(){
        let id = this.dataset.id;
        let quantidade = 1;
        atualizarEstoque(id, quantidade, this);
    }

    function diminuirEstoque(){
        let id = this.dataset.id;
        let quantidade = -1;
        atualizarEstoque(id, quantidade, this);
    }

    function alterarEstoqueManual(){
        let id = this.dataset.id;
        let novoEstoque = parseInt(this.value);
        
        if(novoEstoque < 0){
            alert('Estoque não pode ser negativo!');
            this.value = 0;
            return;
        }

        let card = this.parentElement.parentElement.parentElement.parentElement;
        let textoEstoque = card.querySelector('[data-estoque-valor]');
        let estoqueAtual = parseInt(textoEstoque.textContent);
        
        let diferenca = novoEstoque - estoqueAtual;
        
        atualizarEstoque(id, diferenca, this);
    }

    function atualizarEstoque(id, quantidade, elemento){
        fetch('/admin/atualizarEstoque', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({id: id, quantidade: quantidade})
        })
        .then(function(resposta){
            return resposta.json();
        })
        .then(function(corpo){
            if(corpo.ok){
                let card = elemento.parentElement.parentElement.parentElement.parentElement;
                let inputEstoque = card.querySelector('.inputEstoque');
                inputEstoque.value = corpo.estoque;
                
                let textoEstoque = card.querySelector('[data-estoque-valor]');
                textoEstoque.textContent = corpo.estoque;
            }
            else{
                alert(corpo.msg);
            }
        })
    }

    function excluir(){

        let btn = this;
        let id = this.dataset.id;
        let tipo = this.dataset.tipo;
        let nome = this.dataset.nome;
        let aux;
        if(tipo == 1){aux = 'do Produto'}
        if(tipo == 2){aux = 'do Insumo'}
        if(tipo == 3){aux = 'do Serviço'}
        if(tipo == 4){aux = 'do Equipamento Agrícola'}
        if(tipo == 5){aux = 'da Marca'}
        if(tipo == 6){aux = 'da Categoria'}

        let msg = 'Confirma a excluisão '+aux+': '+nome+'?';
        if(confirm(msg)) {
            let obj = {
                tipo: tipo,
                id: id
            }
            fetch("/admin/excluir", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({obj})
            })
            .then(function(resposta) {
                return resposta.json();
            })
            .then(function(corpo) {
                alert(corpo.msg);
                if(corpo.ok) {
                    btn.parentElement.parentElement.remove()
                }
            })
        }
    }

    // PESQUISA SIMPLES
    const campoPesquisa = document.getElementById('searchItens');
    if(campoPesquisa){
        campoPesquisa.addEventListener('keyup', function(){
            let termo = this.value.toLowerCase();
            // Produtos / Insumos (cards)
            let div1 = document.querySelector('div.row[id="1"]');
            let div2 = document.querySelector('div.row[id="2"]');
            if(div1){
                let cards = div1.querySelectorAll('.card');
                for(let i=0;i<cards.length;i++){
                    let titulo = cards[i].querySelector('h5');
                    let idTexto = cards[i].querySelector('small');
                    if(!titulo) continue;
                    let nome = titulo.innerText.toLowerCase();
                    let id = idTexto ? idTexto.innerText.toLowerCase() : '';
                    let mostrar = nome.includes(termo) || id.includes(termo);
                    cards[i].parentElement.style.display = mostrar ? '' : 'none';
                }
            }
            if(div2){
                let cards = div2.querySelectorAll('.card');
                for(let i=0;i<cards.length;i++){
                    let titulo = cards[i].querySelector('h5');
                    let idTexto = cards[i].querySelector('small');
                    if(!titulo) continue;
                    let nome = titulo.innerText.toLowerCase();
                    let id = idTexto ? idTexto.innerText.toLowerCase() : '';
                    let mostrar = nome.includes(termo) || id.includes(termo);
                    cards[i].parentElement.style.display = mostrar ? '' : 'none';
                }
            }
            // Tabelas (servicos, marcas, categorias, equipamentos)
            let tabela3 = document.querySelector('table[id="3"]');
            let tabela4 = document.querySelector('table[id="4"]');
            let tabela5 = document.querySelector('table[id="5"]');
            let tabela6 = document.querySelector('table[id="6"]');
            let tabelas = [tabela3, tabela4, tabela5, tabela6];
            for(let t=0;t<tabelas.length;t++){
                if(!tabelas[t]) continue;
                let linhas = tabelas[t].querySelectorAll('tbody tr');
                for(let j=0;j<linhas.length;j++){
                    let txtLinha = linhas[j].innerText.toLowerCase();
                    linhas[j].style.display = txtLinha.includes(termo) ? '' : 'none';
                }
            }
        });
    }
})