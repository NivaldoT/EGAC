document.addEventListener('DOMContentLoaded', function(){
    let btnAdmin = document.getElementById('btnAdmin');
    fetch('/usuario/buscarPessoaLogin')
    .then(function(resposta){
        return resposta.json()
    })
    .then(function(corpo){
        if(corpo.ok){
            btnAdmin.style.display = 'block';
        }
    })
})