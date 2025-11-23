document.addEventListener('DOMContentLoaded',  function(){

    let caixa = document.getElementById('caixaStatus');
    let caixaValor = document.getElementById('caixaValor');
    getCaixa()
    function getCaixa(){
        fetch('/admin/caixa/getStatus')
        .then(function(resposta){
            return resposta.json()
        })
        .then(function(corpo){
            if(corpo.status == 0){
                caixa.textContent = 'Caixa: Fechado';
            }
            if(corpo.status == 1){
                caixa.textContent = 'Caixa: Aberto';
                caixaValor.style.display = 'block';
                caixaValor.textContent = 'Valor: R$'+corpo.valor;
            }
        })
    }
    document.getElementById('abrirCaixa').addEventListener('click', abrirCaixa);
    document.getElementById('fecharCaixa').addEventListener('click', fecharCaixa);

    function abrirCaixa(){
        let valor = parseFloat(prompt('Qual o valor inicial do caixa?'));
        if(!isNaN(valor)){
            obj = {valor: valor}
            fetch('/admin/caixa/abrir',{
                method:'POST',
                headers: {
                    'Content-type':'application/json'                
                },
                body: JSON.stringify(obj)
            })
            .then(function(resposta){
                return resposta.json()
            })
            .then(function (corpo){
                alert(corpo.ok)
                getCaixa();
            })
        }
        else{
            alert('Valor Inválido!!');
        }
    }
})