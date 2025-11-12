document.addEventListener('DOMContentLoaded', function(){

    let voltar = document.getElementById('voltar');
    let tipo = document.getElementById('tipoItem');
    MudarEnderecoVoltar();
    function MudarEnderecoVoltar(){
        voltar.href = '/admin/listagem/'+tipo.value;
    }

    let precomax = document.getElementById('precoval');
    precomax.addEventListener('keydown', function(){
        if(precomax.value>9999999.00)
            precomax.value = 9999999.00;
    })

    let inputBuscar = document.getElementById('procurarPessoaval');  //Buscar Pessoas Equipamento Agricola
    inputBuscar.addEventListener('blur', function(){

        let nome = {nome : inputBuscar.value};
        fetch("/admin/buscarCliente",{
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
            let selectPessoa = document.getElementById('pessoaval');
            selectPessoa.innerHTML = '';
            if(corpo.lista.length == 0 ){
                selectPessoa.innerHTML = '<option value="0">Pessoa não existente no banco de dados!</option>'
            }
            for(let i=0; i < corpo.lista.length;i++){
                pessoa = corpo.lista[i];
                selectPessoa.innerHTML += '<option value="'+pessoa.id+'">'+pessoa.nome+'</option>' 
            }
        })
    });

    let btn = document.getElementById('cadastrar');
    btn.addEventListener('click', gravar);

    let tipoItem = document.getElementById('tipoItem');
    
    tipoItem.addEventListener('change', change)
    change();
    function change(){
        const preco = document.getElementById('preco');
        const inputPessoa = document.getElementById('procurarPessoaval');
        const pessoa = document.getElementById('pessoaval');
        const descricao = document.getElementById('descricao');
        const marca = document.getElementById('marca');
        const categoria = document.getElementById('categoria');
        if(tipoItem.value == 1 || tipoItem.value == 2){ //PRODUTO INSUMO
            preco.style.display = 'block';            
            inputPessoa.style.display = 'none';
            pessoa.style.display = 'none';
            descricao.style.display = 'block';
            marca.style.display = 'block';
            categoria.style.display = 'block';
        }
        if(tipoItem.value == 3){ //serviço
            preco.style.display = 'block';  
            inputPessoa.style.display = 'none';
            pessoa.style.display = 'none';
            descricao.style.display = 'block';
            marca.style.display = 'none';
            categoria.style.display = 'none';
        }
        if(tipoItem.value == 4){ // equip Agricola
            preco.style.display = 'none';
            inputPessoa.style.display = 'block';
            pessoa.style.display = 'block';
            descricao.style.display = 'block';
            marca.style.display = 'block';
            categoria.style.display = 'block';
        }
        if(tipoItem.value == 5){ // marca 
            preco.style.display = 'none';
            inputPessoa.style.display = 'none';
            pessoa.style.display = 'none';
            descricao.style.display = 'none';
            marca.style.display = 'none';
            categoria.style.display = 'none';
        }
        if(tipoItem.value == 6){ // categoria
            preco.style.display = 'none';
            inputPessoa.style.display = 'none';
            pessoa.style.display = 'none';
            descricao.style.display = 'none';
            marca.style.display = 'none';
            categoria.style.display = 'none';
        }
    }

    function gravar(){
        const id = document.getElementById('prodId');

        const nome = document.getElementById('nomeval');
        const preco = document.getElementById('precoval');
        const pessoa = document.getElementById('pessoaval');
        const descricao = document.getElementById('descricaoval');
        const marca = document.getElementById('marcaval');
        const tipoItem = document.getElementById('tipoItem');
        const categoria = document.getElementById('categoriaval');

        let vetorVal= [];
        if(!nome.value)
            vetorVal.push(nome);
        else
            nome.style.borderColor = '';

        if(!isFinite(Number(preco.value)) || !preco.value || preco.value < 0)
            vetorVal.push(preco);
        else
            preco.style.borderColor = '';

        if(pessoa.value == 0)
            vetorVal.push(pessoa);
        else
            pessoa.style.borderColor = '';
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
        
        if(categoria.value == 0)
            vetorVal.push(categoria);
        else
            categoria.style.borderColor = '';
        console.log(vetorVal)
        if(tipoItem.value == 1 || tipoItem.value == 2){ // PRODUTO INSUMO
            if(nome.value && isFinite(Number(preco.value)) && preco.value && descricao.value && categoria.value > 0 && preco.value >= 0 && marca.value > 0){
                obj = {
                    id: id.value,
                    tipoItem : tipoItem.value,
                    nome : nome.value,
                    preco: preco.value,
                    descricao: descricao.value,
                    categoria: categoria.value,
                    marca: marca.value
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
        if(tipoItem.value == 3){ // SERVICO
            if(nome.value && isFinite(Number(preco.value)) && preco.value && descricao.value != 0 && preco.value >= 0){
                obj = {
                    id: id.value,
                    tipoItem : tipoItem.value,
                    nome : nome.value,
                    preco: preco.value,
                    descricao: descricao.value
                }
                fetch('/admin/alterarServico',{
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
        if(tipoItem.value == 4){ //EQUIPAMENTO AGRICOLA
            if(nome.value && pessoa.value != 0 && marca.value != 0 && categoria.value != 0){
                obj = {
                    id: id.value,
                    nome : nome.value,
                    pessoa: pessoa.value,
                    marca: marca.value,
                    descricao: descricao.value,
                    categoria: categoria.value
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
        if(tipoItem.value == 5){ // MARCA
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
        if(tipoItem.value == 6){ // CATEGORIA
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
    
        else{
            alert('Favor Preencher os Campos Obrigatórios!');
            for(let i=0; i<vetorVal.length; i++){
                vetorVal[i].style.borderColor = 'red';
            }
        }
    }
})