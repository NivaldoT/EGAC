document.addEventListener('DOMContentLoaded', function(){
    
    let inputBuscar = document.getElementById('procurarPessoaval');
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

    function gravar(){
        const nome = document.getElementById('nomeval');
        const pessoa = document.getElementById('pessoaval');
        const preco = document.getElementById('precoval');
        const marca = document.getElementById('marcaval');
        const descricao = document.getElementById('descricaoval');
        const categoria = document.getElementById('categoriaval');

        let vetorVal= [];
        if(!nome.value)
            vetorVal.push(nome);
        else
            nome.style.borderColor = '';

        if(pessoa.value == 0)
            vetorVal.push(pessoa);
        else
            pessoa.style.borderColor = '';

        if(marca.value == 0)
            vetorVal.push(marca);
        else
            marca.style.borderColor = '';

        if(!descricao.value)
            vetorVal.push(descricao);
        else
            descricao.style.borderColor = '';
        if(categoria.value == 0)
            vetorVal.push(categoria);
        else
            categoria.style.borderColor = '';

        if(vetorVal.length == 0){
            //if(nome.value && pessoa.value != 0 && preco.value && marca.value != 0){
                obj = {
                    nome : nome.value,
                    pessoa: pessoa.value,
                    marca: marca.value,
                    descricao: descricao.value,
                    categoria: categoria.value
                }
                fetch('/admin/cadastrarEqAgricola',{
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
                        nome.value='';
                        pessoa.value='';
                        marca.value='';
                        descricao.value ='';
                        categoria.value ='';
                })
            //}
        }
        else{
            alert('Favor Preencher os Campos Obrigatórios!');
            for(let i=0; i<vetorVal.length; i++){
                vetorVal[i].style.borderColor = 'red';
            }
        }
    }
})