document.addEventListener('DOMContentLoaded', function(){

    document.getElementById('receberOS').addEventListener('click', gravar);
    
    const numParcelas = document.getElementById('inputParcelas');
    numParcelas.addEventListener('keyup', validarParcela);

    function validarParcela(){
        let ok = true;
        if(numParcelas.value == ""){
            ok = false;
        }
        if(numParcelas.value > 12){
            numParcelas.value = 12;
            ok = false;
        }
        if(numParcelas.value<1){
            numParcelas.value = 1;
            ok = false;
        }
        if(isNaN(numParcelas.value)){
            numParcelas.value = '';
            ok = false;
        }
        if(ok){ return true; }
        else { return false; };
    }

    function gravar(){
        const idOS = document.getElementById('idOS');
        
        if(validarParcela() && confirm('Confirma o Recebimento da Ordem de Serviço?')){
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
                alert(corpo.ok+corpo.msg);
                if(corpo.ok){
                    //window.location.replace('/admin/OrdemServicos/');
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