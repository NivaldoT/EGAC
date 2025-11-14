document.addEventListener('DOMContentLoaded', function(){
    
    let inputProcurarPessoa = document.getElementById('procurarPessoaval');
    let selectPessoa = document.getElementById('pessoaval');
    let selectEqAg = document.getElementById('EqAgricolaval');

    inputProcurarPessoa.addEventListener('blur', function(){
        if(inputProcurarPessoa.value){
            let nome = {nome : inputProcurarPessoa.value};
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
                selectPessoa.innerHTML = '';
                if(corpo.lista.length == 0 ){
                    selectPessoa.innerHTML = '<option value="0">Pessoa não existente no banco de dados!</option>'
                    selectEqAg.innerHTML = '<option value="0" selected>Insira o nome do proprietário | empresa no campo acima...</option>'
                }
                else{
                    for(let i=0; i < corpo.lista.length;i++){
                        let pessoa = corpo.lista[i];
                        selectPessoa.innerHTML += '<option value="'+pessoa.id+'">'+pessoa.nome+'</option>' 
                    }
                    procurarEqAg();
                }
            })
        }
    });
    selectPessoa.addEventListener('change', procurarEqAg);
    
    function procurarEqAg(){

        fetch("/admin/buscarEqAgricolaCliente",{
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({id: selectPessoa.value})
            })
        .then(function(resposta){
            return resposta.json();
        })
        .then(function(corpo){
            selectEqAg.innerHTML = '';
            if(corpo.lista.length == 0 ){
                selectEqAg.innerHTML = '<option value="0">'+selectPessoa.textContent+' não possui Equipamentos Agrícolas cadastrados!</option>'
            }
            for(let i=0; i < corpo.lista.length;i++){
                let EqAg = corpo.lista[i];
                selectEqAg.innerHTML += '<option value="'+EqAg.id+'">'+EqAg.nome+'</option>' 
            }
        })
    };
    
    let inputProcurarFuncionario = document.getElementById('procurarFuncval');
    inputProcurarFuncionario.addEventListener('blur', function(){

        let nome = {nome : inputProcurarFuncionario.value};
        fetch("/admin/buscarFuncionario",{
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
            let selectFuncionario = document.getElementById('funcval');
            selectFuncionario.innerHTML = '';
            if(corpo.lista.length == 0 ){
                selectFuncionario.innerHTML = '<option value="0">Funcionário não existente no banco de dados!</option>'
            }
            for(let i=0; i < corpo.lista.length;i++){
                let func = corpo.lista[i];
                selectFuncionario.innerHTML += '<option value="'+func.id+'">'+func.nome+'</option>' 
            }
        })
    });


    let btn = document.getElementById('cadastrar');
    btn.addEventListener('click', gravar);

    function gravar(){
        const pessoa = document.getElementById('pessoaval');
        const eqAg = document.getElementById('EqAgricolaval');
        const servico = document.getElementById('servicoval');
        const func = document.getElementById('funcval');
        const comentario = document.getElementById('comentarioval');

        let vetorVal= [];
        if(pessoa.value == 0)
            vetorVal.push(pessoa);
        else
            pessoa.style.borderColor = '';

        if(eqAg.value == 0)
            vetorVal.push(eqAg);
        else
            eqAg.style.borderColor = '';

        if(servico.value == 0)
            vetorVal.push(servico);
        else
            servico.style.borderColor = '';

        if(func.value == 0)
            vetorVal.push(func);
        else
            func.style.borderColor = '';

        if(vetorVal.length == 0){
            //if(nome.value && pessoa.value != 0 && preco.value && marca.value != 0){
                obj = {
                    pessoa: pessoa.value,
                    EqAg: eqAg.value,
                    servico: servico.value,
                    func: func.value,
                    comentario: comentario.value
                }
                fetch('/admin/ordemServicos/abrir',{
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
                        pessoa.value='';
                        eqAg.value='';
                        servico.value='';
                        func.value ='';
                        comentario.value = '';
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