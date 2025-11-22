document.addEventListener('DOMContentLoaded', function(){
    const select = document.getElementById('select');
    const btnCadastrar = document.getElementById('btnCadastrar');
    
    change();
    select.addEventListener('change', function(){
        // Redirecionar para a rota correta
        window.location.href = '/admin/clientes/' + select.value;
    });

    function change(){    
        let listas = document.querySelectorAll('table');            // SELECIONA A TABELA A EXIBIR
        for(let i=0; i< listas.length; i++){
            if(listas[i].id == select.value)
                listas[i].style.display = 'table';
            else
                listas[i].style.display = 'none';
        }
        
        // Atualizar botão de cadastro conforme seleção
        if(select.value == 'pf') {
            btnCadastrar.href = '/admin/PFCadastro';
            btnCadastrar.textContent = 'Cadastrar Pessoa Física';
        } else if(select.value == 'pj') {
            btnCadastrar.href = '/admin/PJCadastro';
            btnCadastrar.textContent = 'Cadastrar Pessoa Jurídica';
        } else if(select.value == 'funcionarios') {
            btnCadastrar.href = '/admin/PFCadastro';
            btnCadastrar.textContent = 'Cadastrar Funcionário';
        }
    }

    const btnExcluir = document.querySelectorAll('.btnExcluir');
    for(let i=0;i<btnExcluir.length;i++)
        btnExcluir[i].addEventListener('click',excluir);
    
    function excluir(){

        let btn = this;
        let id = this.dataset.id;
        let nome = this.dataset.nome;

        let msg = 'Confirma a exclusão do Cliente: '+nome+'?';
        if(confirm(msg)) {
            let obj = {
                id: id
            }
            fetch("/admin/excluirCliente", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({obj})
            })
            .then(function(resposta) {
                return resposta.json();
            })
            .then(function(corpo) {
                alert(corpo.msg);
                if(corpo.ok) {
                    btn.parentElement.parentElement.remove()
                }
            })
        }
    }
})