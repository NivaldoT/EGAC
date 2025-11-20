document.addEventListener('DOMContentLoaded', function(){

    let OSInvalida = document.getElementById('OSInvalida');
    if(OSInvalida.value > 0 ){alert('A ORDEM DE SERVIÇO '+OSInvalida.value+' É INVÁLIDA PARA ESTE PROCESSO!!'); window.location.replace('/admin/OrdemServicos/');}


    const numParcelas = document.getElementById('selectParcelas');
    let msgErro = document.getElementById('msgErroFinal'); 
    numParcelas.addEventListener('change', function(){
        msgErro.style.display = 'none';
    })
    document.getElementById('receberOS').addEventListener('click', gravar);
    function gravar(){
        const idOS = document.getElementById('idOS');
        
        if(numParcelas.value != 0  && confirm('Confirma o Recebimento da Ordem de Serviço?')){
            obj = {
                idOS: idOS.value,
                numParcelas: numParcelas.value
            }
            fetch('/admin/ordemServicos/receber',{
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
            msgErro.textContent = 'Favor selecionar quantidade de parcelas!';
            msgErro.style.display = 'block';
        }
    }
})