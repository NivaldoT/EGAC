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

    function atualizarEstoque(id, quantidade, botao){
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
                let card = botao.parentElement.parentElement.parentElement.parentElement;
                let badge = card.querySelector('.badge');
                badge.textContent = corpo.estoque;
                
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
})