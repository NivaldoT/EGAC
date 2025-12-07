document.addEventListener('DOMContentLoaded', function() {


    let tableItensDevolucao = document.getElementById('itensDevolucao');
    let btnAdicionarItens = document.getElementById('btnAdicionarItens');
    
    let itensDevolucao = [];
    btnAdicionarItens.addEventListener('click', function() { //adicionar itens selecionados para devolução
        let ok = true;
        let checkboxes = document.querySelectorAll('.checkItens');
        for(let i=0; i<checkboxes.length; i++){
            if(checkboxes[i].checked){
                for(let j=0; j<itensDevolucao.length; j++){ //verificar se o item já não foi adicionado ao array de itens para devolução
                    if(itensDevolucao[j].id == checkboxes[i].value){
                        ok = false
                    }
                }
                if(ok){
                    document.getElementById('cardDevolucao').classList.remove('d-none');//mostrar card de devolução
                    itensDevolucao.push({id: checkboxes[i].value, nome: checkboxes[i].dataset.nome});   //adicionar item ao array de itens para devolução
                    let html = `
                    <tr>
                        <td>${checkboxes[i].dataset.nome}</td>
                        <td><input type="number" class="form-control inputQtd" data-id='${checkboxes[i].value}'></td>
                        <td><input type="text" class="form-control inputMotivo" data-id='${checkboxes[i].value}'></td>
                        <td><button class="btn btn-danger btnRemoverItemDevolucao" data-id='${checkboxes[i].value}'><i class="bi bi-trash-fill"></i></button></td>
                    </tr>`;
                    tableItensDevolucao.innerHTML += html;
                    let btnsRemover = document.querySelectorAll('.btnRemoverItemDevolucao');
                    for(let j=0; j<btnsRemover.length; j++){
                        btnsRemover[j].addEventListener('click', removerItemDevolucao);
                    }
                }
            }

        }
    })

    function removerItemDevolucao(){
        this.parentElement.parentElement.remove();
        let id = this.dataset.id;
        for(let i=0; i<itensDevolucao.length; i++){
            if(itensDevolucao[i].id == id){
                itensDevolucao.splice(i,1);
                i = itensDevolucao.length;
            }
        }
        if(itensDevolucao.length == 0){
            document.getElementById('cardDevolucao').classList.add('d-none');//esconder card de devolução
        }
    }




    let btnDevolucao = document.getElementById('btnDevolucao');
    btnDevolucao.addEventListener('click', function() {
        let compraId = document.getElementById('compraId').value;
        fetch('/admin/buscarItensCompraPorId/'+compraId)
        .then(function(resposta){
            return resposta.json();
        })
        .then(function(corpo){
            let itensCompra = corpo;
            let ok = true;
            if(itensDevolucao.length > 0){
                for(let i=0; i<itensDevolucao.length; i++){
                    let compraQtd; //quantidade comprada do item
                    for(let j=0; j<itensCompra.length; j++){
                        if(itensDevolucao[i].id == itensCompra[j].idProduto){   //pegar quantidade comprada do item para validação
                            compraQtd = itensCompra[j].qtd;
                            itensDevolucao[i].preco = itensCompra[j].precoUnitario; //pegar preço do item para gravar na devolução
                        }
                    }
                    let inputQtd = tableItensDevolucao.querySelector(`.inputQtd[data-id='${itensDevolucao[i].id}']`).value; //pegar quantidade digitada
                    let inputMotivo = tableItensDevolucao.querySelector(`.inputMotivo[data-id='${itensDevolucao[i].id}']`).value;
                    itensDevolucao[i].qtd = inputQtd;
                    itensDevolucao[i].motivo = inputMotivo;

                    if(!inputQtd || inputQtd <= 0 || isNaN(inputQtd) || inputQtd > compraQtd){
                        alert('Preencha uma quantidade válida para o item: '+itensDevolucao[i].nome);
                        ok = false;
                    }
                    if(!inputMotivo){
                        alert('Preencha um motivo para o item: '+itensDevolucao[i].nome);
                        ok = false;
                    }
                }
                if(ok){
                    obj = {itensDevolucao: itensDevolucao, idCompra: compraId};
                    fetch('/admin/devolverCompra',{
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(obj)
                    })
                    .then(function(resposta){
                        return resposta.json();
                    })
                    .then(function(corpo){
                            alert(corpo.msg);
                            // location.reload();
                    })
                }
            }
        })
    })
})