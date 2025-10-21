document.addEventListener('DOMContentLoaded', function(){

    let precomax = document.getElementById('precoval');
    precomax.addEventListener('keydown', function(){
        if(precomax.value>9999999.00)
            precomax.value = 9999999.00;
    })
    
    let btn = document.getElementById('cadastrar');
    btn.addEventListener('click', gravar);

    function gravar(){
        const nome = document.getElementById('nomeval');
        const preco = document.getElementById('precoval');
        const marca = document.getElementById('marcaval');
        const descricao = document.getElementById('descricaoval');
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
            if(nome.value && isFinite(Number(preco.value)) && preco.value && marca.value != 0){
                obj = {
                    nome : nome.value,
                    preco: preco.value,
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
                        preco.value='';
                        marca.value='';
                        descricao.value ='';
                        categoria.value ='0';
                })
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