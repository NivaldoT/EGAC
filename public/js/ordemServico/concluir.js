document.addEventListener('DOMContentLoaded', function(){
    let OSInvalida = document.getElementById('OSInvalida');
    if(OSInvalida.value > 0 ){alert('A ORDEM DE SERVIÇO '+OSInvalida.value+' É INVÁLIDA PARA ESTE PROCESSO!!'); window.location.replace('/admin/OrdemServicos/');}
    
    let inputProcurarInsumo = document.getElementById('procurarInsumoval');
    let inputInsumoQtd = document.getElementById('quantidadeInsumoval');
    let selectInsumo = document.getElementById('insumoval')
    inputProcurarInsumo.addEventListener('blur', function(){
        if(inputProcurarInsumo.value){
            let nome = {nome : inputProcurarInsumo.value};
            fetch("/admin/buscarInsumoNome",{
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
                selectInsumo.innerHTML = '';
                if(corpo.lista.length == 0 ){
                    selectInsumo.innerHTML = '<option value="0">Insumo não existente no banco de dados!</option>'
                }
                else{
                    for(let i=0; i < corpo.lista.length;i++){
                        let insumo = corpo.lista[i];
                        selectInsumo.innerHTML += '<option value="'+insumo.id+'">'+insumo.nome+'</option>' 
                    }
                }
            })
        }
    });
    
    let listabtnExcluirInsumo = document.querySelectorAll('.btnExcluirInsumo');
    let msgErroInsumo = document.getElementById('msgErroInsumo');
    let listaInsumo = []
    let tableInsumo = document.getElementById('tableInsumo'); 
    document.getElementById('AddInsumo').addEventListener('click', addInsumo);
    function addInsumo(){
        msgErroInsumo.textContent = '';
        let ok = true;
        if(selectInsumo.value == 0){
            ok = false;
            msgErroInsumo.textContent = 'Selecione um Item para adicionar!';
        }
        if(ok && !inputInsumoQtd.value || inputInsumoQtd.value == '0'){
            ok = false;
            msgErroInsumo.textContent = 'Insira a Quantidade do insumo!';
        }
        if(ok){
            for(i in listaInsumo){
                if(listaInsumo[i].idProd == selectInsumo.value){
                    ok = false;
                    msgErroInsumo.textContent = 'Este item já foi adicionado!';
                }
            }
        }
        if(ok){
            obj = {id: selectInsumo.value};
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
                .then(function(corpo) {//recebe o corpo em formato de obj genérico
                    //console.log(corpo.prod);
                    prod = corpo.prod;
                    if(prod.estoque < inputInsumoQtd.value){
                        ok = false;
                        msgErroInsumo.textContent = 'Quantidade inválida, Quantidade no estoque: '+prod.estoque;
                    }
                    if(ok){
                        listaInsumo.push({idProd: selectInsumo.value, qtd: inputInsumoQtd.value});
                        console.log(listaInsumo);
                        
                        tableInsumo.innerHTML+= `
                        <tr>
                        <td>${selectInsumo.value}</td>
                        <td>${selectInsumo[selectInsumo.selectedIndex].textContent}</td>
                        <td>${inputInsumoQtd.value}</td>
                        <td><button class='btn btn-danger btnExcluirInsumo' data-id='${selectInsumo.value}'><i class="bi bi-trash-fill"></i></button></td>
                        </tr>`;
            
                        listabtnExcluirInsumo = [];
                        listabtnExcluirInsumo = document.querySelectorAll('.btnExcluirInsumo');
            
                        for(let i=0; i<listabtnExcluirInsumo.length;i++){
                            listabtnExcluirInsumo[i].addEventListener('click', removerInsumo);
                        }
                    }
                })
        }
    }

    function removerInsumo(){
        let id = this.dataset.id
        for(let i=0; i< listaInsumo.length;i++){
            if(listaInsumo[i].idProd == id){
                listaInsumo.splice(i,1);
            }
        }
        this.parentElement.parentElement.remove();
    }
    
    let inputProcurarFuncionario = document.getElementById('procurarFuncval');
    let selectFuncionario = document.getElementById('funcval');
    inputProcurarFuncionario.addEventListener('blur', function(){
        if(inputProcurarFuncionario.value){
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
                selectFuncionario.innerHTML = '';
                if(corpo.lista.length == 0 ){
                    selectFuncionario.innerHTML = '<option value="0">Funcionário não existente no banco de dados!</option>'
                }
                for(let i=0; i < corpo.lista.length;i++){
                    let func = corpo.lista[i];
                    selectFuncionario.innerHTML += '<option value="'+func.id+'">'+func.nome+'</option>' 
                }
            })
        }
    });

    let listabtnExcluirSubItem = document.querySelectorAll('.btnExcluirSubItem');
    let msgErroSubItem = document.getElementById('msgErroSubItem');
    let listaSubItem = []
    let tableSubItem = document.getElementById('tableSubItem'); 
    let subItemval = document.getElementById('subItemval');
    document.getElementById('AddSubItem').addEventListener('click', addSubItem);
    function addSubItem(){
        msgErroSubItem.textContent = '';
        let ok = true;
        if(!subItemval.value || !(/[a-z]/i.test(subItemval.value))){
            ok = false;
            msgErroSubItem.textContent = 'Escreva um Nome para o Sub-Item!'
        }
        if(selectFuncionario.value == 0 && ok){
            ok = false;
            msgErroSubItem.textContent = 'Selecione um Funcionario para adicionar Sub-Item!';
        }
        if(ok){
            for(i in listaSubItem){
                if(listaSubItem[i].nome == subItemval.value){
                    ok = false;
                    msgErroSubItem.textContent = 'Este item já foi adicionado!';
                }
            }
        }
        if(ok){
            listaSubItem.push({idFunc: selectFuncionario.value, nome: subItemval.value});
            console.log(listaSubItem);
            
            tableSubItem.innerHTML+= `
            <tr>
            <td>${selectFuncionario.value}</td>
            <td>${selectFuncionario[selectFuncionario.selectedIndex].textContent}</td>
            <td>${subItemval.value}</td>
            <td><button class='btn btn-danger btnExcluirSubItem' data-id='${subItemval.value}'><i class="bi bi-trash-fill"></i></button></td>
            </tr>`;

            listabtnExcluirSubItem = [];
            listabtnExcluirSubItem = document.querySelectorAll('.btnExcluirSubItem');

            for(let i=0; i<listabtnExcluirSubItem.length;i++){
                listabtnExcluirSubItem[i].addEventListener('click', removerSubItem);
            }
        }
    }

    function removerSubItem(){
        let id = this.dataset.id
        for(let i=0;i<listaSubItem.length;i++){
            if(listaSubItem[i].nome == id){
                listaSubItem.splice(i,1);
            }
        }
        this.parentElement.parentElement.remove();
    }

    document.getElementById('concluirOS').addEventListener('click', gravar);

    function gravar(){
        const idOS = document.getElementById('idOS');
        const comentario = document.getElementById('comentarioval');
        
        if(listaSubItem.length>0 && confirm('Confirma a conclusão da Ordem de Serviço?')){
            obj = {
                idOS: idOS.value,
                listaInsumo: listaInsumo,
                listaSubItem: listaSubItem,
                comentario: comentario.value
            }
            fetch('/admin/ordemServicos/concluir',{
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
                if(corpo.ok){
                    window.location.replace('/admin/OrdemServicos/');
                }
            })
        }
        else{
            let msgErro = document.getElementById('msgErroFinal'); 
            msgErro.textContent = 'Favor Inserir ao menos um Sub-Item ao Serviço';
            msgErro.style.display = 'block';
        }
    }
})