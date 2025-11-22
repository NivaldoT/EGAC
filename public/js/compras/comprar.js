document.addEventListener('DOMContentLoaded', function(){


    let inputProcurarFornecedor = document.getElementById('procurarFornecedorval');
    let selectFornecedor = document.getElementById('Fornecedorval');
    inputProcurarFornecedor.addEventListener('blur', function(){
        if(inputProcurarFornecedor.value){
            let nome = {nome : inputProcurarFornecedor.value};
            fetch("/admin/buscarFornecedor",{
                method: 'POST',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(nome)
            })
            .then(function(resposta){
                return resposta.json();
            })
            .then(function(corpo){
                selectFornecedor.innerHTML = '';
                if(corpo.lista.length == 0 ){
                    selectFornecedor.innerHTML = '<option value="0">Fornecedor não existente no banco de dados!</option>'
                }
                for(let i=0; i < corpo.lista.length;i++){
                    let fornecedor = corpo.lista[i];
                    selectFornecedor.innerHTML += '<option value="'+fornecedor.id+'">'+fornecedor.nome+'</option>' 
                }
            })
        }
    });
    

    let inputProcurarProduto = document.getElementById('procurarProdutoval');
    let inputProdutoQtd = document.getElementById('quantidadeProdutoval');
    let selectProduto = document.getElementById('Produtoval')
    inputProcurarProduto.addEventListener('blur', function(){
        if(inputProcurarProduto.value){
            let nome = {nome : inputProcurarProduto.value};
            fetch("/admin/buscarProdutoNome",{
                method: 'POST',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(nome)
                })
            .then(function(resposta){
                return resposta.json();
            })
            .then(function(corpo){
                selectProduto.innerHTML = '';
                if(corpo.lista.length == 0 ){
                    selectProduto.innerHTML = '<option value="0">Produto não existente no banco de dados!</option>'
                }
                else{
                    for(let i=0; i < corpo.lista.length;i++){
                        let Produto = corpo.lista[i];
                        selectProduto.innerHTML += '<option value="'+Produto.id+'">'+Produto.nome+'</option>' 
                    }
                }
            })
        }
    });
    
    let precoProduto = document.getElementById('precoProdutoval');
    let listabtnExcluirProduto = document.querySelectorAll('.btnExcluirProduto');
    let msgErroProduto = document.getElementById('msgErroProduto');
    let listaProduto = []
    let tableProduto = document.getElementById('tableProduto'); 
    document.getElementById('AddProduto').addEventListener('click', addProduto);
    function addProduto(){
        msgErroProduto.textContent = '';
        let ok = true;
        if(selectProduto.value == 0){
            ok = false;
            msgErroProduto.textContent = 'Selecione um Item para adicionar!';
        }
        if(ok && !inputProdutoQtd.value || inputProdutoQtd.value == '0'){
            ok = false;
            msgErroProduto.textContent = 'Insira a Quantidade do Produto!';
        }
        if(ok && inputProdutoQtd.value<0){
            ok = false;
            msgErroProduto.textContent = 'Insira uma quantidade válida!';
        }
        if(ok && !precoProduto.value || precoProduto.value == '0'){
            ok = false;
            msgErroProduto.textContent = 'Insira o Preço do Produto!'
        }
        if(ok && precoProduto.value<0){
            ok = false;
            msgErroProduto.textContent = 'Insira um Preço válido!';
        }
        if(ok){
            for(i in listaProduto){
                if(listaProduto[i].idProd == selectProduto.value){
                    ok = false;
                    msgErroProduto.textContent = 'Este item já foi adicionado!';
                }
            }
        }
        if(ok){
            obj = {id: selectProduto.value};
            fetch('/admin/buscarProdPorId',{
                    method: 'POST',
                    headers: {
                        'Content-type': 'application/json'
                    },
                    body: JSON.stringify(obj)
                })
                .then(function(resposta) {//recebe a resposta como retorno do fetch
                    return resposta.json(); //converte o corpo da resposta para json (gera uma nova promise)
                })
                .then(function(corpo) {
                    //console.log(corpo.prod);
                    prod = corpo.prod;
                    listaProduto.push({idProd: selectProduto.value, qtd: inputProdutoQtd.value, preco: precoProduto.value});
                    console.log(listaProduto);
                    
                    tableProduto.innerHTML+= `
                    <tr>
                    <td>${selectProduto.value}</td>
                    <td>${selectProduto[selectProduto.selectedIndex].textContent}</td>
                    <td>${inputProdutoQtd.value}</td>
                    <td>${precoProduto.value}</td>
                    <td>${precoProduto.value * inputProdutoQtd.value}</td>
                    <td><button class='btn btn-danger btnExcluirProduto' data-id='${selectProduto.value}'><i class="bi bi-trash-fill"></i></button></td>
                    </tr>`;
        
                    listabtnExcluirProduto = [];
                    listabtnExcluirProduto = document.querySelectorAll('.btnExcluirProduto');
        
                    for(let i=0; i<listabtnExcluirProduto.length;i++){
                        listabtnExcluirProduto[i].addEventListener('click', removerProduto);
                    }
                })
        }
    }

    function removerProduto(){
        let id = this.dataset.id
        for(let i=0; i< listaProduto.length;i++){
            if(listaProduto[i].idProd == id){
                listaProduto.splice(i,1);
            }
        }
        this.parentElement.parentElement.remove();
        console.log(listaProduto);
    }

    let msgErro = document.getElementById('msgErroFinal'); 
    document.getElementById('comprar').addEventListener('click', gravar);
    function gravar(){
        msgErro.classList = 'd-none';

        const idFunc = document.getElementById('funcval');
        
        if(listaProduto.length>0 && selectFornecedor.value != 0 && confirm('Confirma a Compra?')){

            obj = {
                idFunc: idFunc.value,
                idPJ: selectFornecedor.value,
                listaProduto: listaProduto,
            }
            fetch('/admin/comprar',{
                method: 'POST',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(obj)
            })
            .then(function(resposta) {//recebe a resposta como retorno do fetch
                return resposta.json(); //converte o corpo da resposta para json (gera uma nova promise)
            })
            .then(function(corpo) {//recebe o corpo em formato de obj genérico
                if(corpo.ok){
                    msgErro.classList = 'alert alert-success d-block';
                }
                if(!corpo.ok){
                    msgErro.classList = 'alert alert-danger d-block';
                }
                msgErro.textContent = corpo.msg;
            })
        }
        else{
            if(listaProduto.length==0)
                msgErro.textContent = 'Favor Inserir ao menos um Produto a Compra!';
            if(selectFornecedor.value==0)
                msgErro.textContent = 'Favor selecionar o Fornecedor!';
            msgErro.classList = 'alert alert-danger d-block';
        }
    }
});