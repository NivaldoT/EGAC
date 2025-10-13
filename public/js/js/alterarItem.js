document.addEventListener('DOMContentLoaded', function(){

    let precomax = document.getElementById('precoval');
    precomax.addEventListener('keydown', function(){
        if(precomax.value>9999999.00)
            precomax.value = 9999999.00;
    })

    let btn = document.getElementById('cadastrar');
    btn.addEventListener('click', gravar);

    let tipoItem = document.getElementById('tipoItem');
    
    tipoItem.addEventListener('change', change)
    change();
    function change(){
        const preco = document.getElementById('preco');
        const descricao = document.getElementById('descricao');
        const marca = document.getElementById('marca');
        const categoria = document.getElementById('categoria');
        if(tipoItem.value == 1 || tipoItem.value == 2 || tipoItem.value == 3){
            preco.style.display = 'block';            
            descricao.style.display = 'block';
            marca.style.display = 'none';
            categoria.style.display = 'block';
        }
        if(tipoItem.value == 4){
            preco.style.display = 'block';  
            descricao.style.display = 'none';
            marca.style.display = 'block';
            categoria.style.display = 'none';
        }
        if(tipoItem.value == 5){
            preco.style.display = 'none';
            descricao.style.display = 'none';
            marca.style.display = 'none';
            categoria.style.display = 'none';
        }
        if(tipoItem.value == 6){
            preco.style.display = 'none';
            descricao.style.display = 'none';
            marca.style.display = 'none';
            categoria.style.display = 'none';
        }
    }

    function gravar(){
        const id = document.getElementById('prodId');

        const nome = document.getElementById('nomeval');
        const preco = document.getElementById('precoval');
        const descricao = document.getElementById('descricaoval');
        const marca = document.getElementById('marcaval');
        const tipoItem = document.getElementById('tipoItem');
        const categoria = document.getElementById('categoriaval');

        let vetorVal= [];
        if(!nome.value)
            vetorVal.push(nome);
        else
            nome.style.borderColor = '';

        if(!isFinite(Number(preco.value)) || !preco.value)
            vetorVal.push(preco);
        else
            preco.style.borderColor = '';

        if(!descricao.value)
            vetorVal.push(descricao);
        else
            descricao.style.borderColor = '';

        if(marca.value == 0)
            vetorVal.push(marca);
        else
            marca.style.borderColor = '';

        if(tipoItem.value == 0)
            vetorVal.push(tipoItem);
        else
            tipoItem.style.borderColor = '';

        if(tipoItem.value == 1 || tipoItem.value == 2 || tipoItem.value == 3){
            if(nome.value && isFinite(Number(preco.value)) && preco.value && descricao.value){
                obj = {
                    id: id.value,
                    tipoItem : tipoItem.value,
                    nome : nome.value,
                    preco: preco.value,
                    descricao: descricao.value,
                    categoria: categoria.value
                }
                fetch('/admin/alterarProduto',{
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
                        alert(corpo.msg);
                })
                return
            }
        }
        if(tipoItem.value == 4){
            if(nome.value && isFinite(Number(preco.value)) && preco.value && marca.value != 0){
                obj = {
                    id: id.value,
                    tipoItem : tipoItem.value,
                    nome : nome.value,
                    preco: preco.value,
                    marca: marca.value
                }
                fetch('/admin/alterarEquipAgricola',{
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
                        alert(corpo.msg)
                })
                return
            }
        }
        if(tipoItem.value == 5){
            if(nome.value){
                obj = {
                    id: id.value,
                    tipoItem : tipoItem.value,
                    nome : nome.value
                }
                fetch('/admin/alterarMarca',{
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
                        alert(corpo.msg);
                })
                return
            }
        }
        if(tipoItem.value == 6){
            if(nome.value){
                obj = {
                    id: id.value,
                    tipoItem : tipoItem.value,
                    nome : nome.value
                }
                fetch('/admin/alterarCategoria',{
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
                        alert(corpo.msg);
                        window.location.reload();
                })
                return
            }
        }
        alert('Favor Preencher os Campos Obrigatórios!');
        for(let i=0; i<vetorVal.length; i++){
            vetorVal[i].style.borderColor = 'red';
        
        }
    }
})