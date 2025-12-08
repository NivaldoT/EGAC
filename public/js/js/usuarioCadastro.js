document.addEventListener('DOMContentLoaded', function(){

    const nome = document.getElementById('cadastro-nome');
    const telefone = document.getElementById('cadastro-telefone');
    const cpf = document.getElementById('cadastro-cpf');
    const endereco = document.getElementById('cadastro-endereco');
    const email = document.getElementById('cadastro-email');
    const senha = document.getElementById('cadastro-senha');
    const confirmar = document.getElementById('cadastro-confirmar');

    const erroNome = document.getElementById('erro-nome');
    const erroTelefone = document.getElementById('erro-telefone');
    const erroCpf = document.getElementById('erro-cpf');
    const erroEndereco = document.getElementById('erro-endereco');
    const erroEmail = document.getElementById('erro-email');
    const erroSenha = document.getElementById('erro-senha');
    const erroConfirmar = document.getElementById('erro-confirmar');

    const formulario = document.getElementById('formulario-cadastro');

    formulario.addEventListener('submit', function(e){
        e.preventDefault();

        erroNome.textContent = '';
        erroTelefone.textContent = '';
        erroCpf.textContent = '';
        erroEndereco.textContent = '';
        erroEmail.textContent = '';
        erroSenha.textContent = '';
        erroConfirmar.textContent = '';

        let valido = true;

        if(!nome.value){
            erroNome.textContent = 'O campo de nome é obrigatório.';
            valido = false;
        }else if(nome.value.trim().length < 3){
            erroNome.textContent = 'O nome deve ter pelo menos 3 caracteres.';
            valido = false;
        }else if(nome.value.trim().split(/\s+/).length < 2){
            erroNome.textContent = 'Por favor insira o nome e sobrenome.';
            valido = false;
        }else if(nome.value.length > 100){
            erroNome.textContent = 'O nome não pode ter mais de 100 caracteres.';
            valido = false;
        }

        if(!telefone.value){
            erroTelefone.textContent = 'O campo de telefone é obrigatório.';
            valido = false;
        }else{
            const telefoneNumeros = telefone.value.replace(/\D/g, '');
            if(telefoneNumeros.length < 10 || telefoneNumeros.length > 11){
                erroTelefone.textContent = 'Por favor insira um telefone válido (10 ou 11 dígitos).';
                valido = false;
            }
        }

        if(!cpf.value){
            erroCpf.textContent = 'O campo de CPF é obrigatório.';
            valido = false;
        }else if(!validaCPF(cpf.value)){
            erroCpf.textContent = 'Por favor insira um CPF válido.';
            valido = false;
        }
        if(!endereco.value){
            erroEndereco.textContent = 'O campo de endereço é obrigatório.';
            valido = false;
        }else if(endereco.value.trim().length < 10){
            erroEndereco.textContent = 'O endereço deve ter pelo menos 10 caracteres.';
            valido = false;
        }else if(endereco.value.trim().split(/\s+/).length < 3){
            erroEndereco.textContent = 'Insira um endereço completo (rua, número, bairro).';
            valido = false;
        }else if(endereco.value.length > 200){
            erroEndereco.textContent = 'O endereço não pode ter mais de 200 caracteres.';
            valido = false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!email.value) {
            erroEmail.textContent = 'O campo de e-mail é obrigatório.';
            valido = false;
        } else if (!emailRegex.test(email.value)) {
            erroEmail.textContent = 'Digite um e-mail válido.';
            valido = false;
        }

        if (!senha.value) {
            erroSenha.textContent = 'O campo de senha é obrigatório.';
            valido = false;
        } else if (senha.value.length < 6) {
            erroSenha.textContent = 'A senha deve ter pelo menos 6 caracteres.';
            valido = false;
        } else if (senha.value.length > 30) {
            erroSenha.textContent = 'A senha não pode ter mais de 30 caracteres.';
            valido = false;
        }

        if(confirmar.value != senha.value){
            erroConfirmar.textContent = 'As senhas não coincidem.';
            valido = false;
        }

        if(valido){
            let obj = {
                nome: nome.value,
                telefone: telefone.value,
                cpf: cpf.value,
                endereco: endereco.value,
                email: email.value,
                senha: senha.value,
                isFunc: 0
            }
            fetch('/usuario/cadastro',{
                method: 'POST',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(obj)
            })
            .then(function(resposta) {
                return resposta.json();
            })
            .then(function(corpo) {
                let msgfinal = document.getElementById('mensagem-sucesso');
                msgfinal.style.display = 'block';
                if(corpo.ok){
                    msgfinal.textContent = corpo.msg;
                    msgfinal.classList = 'text-success';
                    setTimeout(function(){
                        window.location.href = '/usuario/login';
                    }, 2000);
                }
                else{
                    msgfinal.textContent = corpo.msg;
                    msgfinal.classList = 'text-danger';
                }
            })
        }
    });

    nome.addEventListener('keydown', function() {
        erroNome.textContent = '';
    });
    
    // Máscara de telefone
    telefone.addEventListener('input', function(e) {
        let valor = e.target.value.replace(/\D/g, '');
        if (valor.length <= 11) {
            if (valor.length === 11) {
                valor = valor.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
            } else if (valor.length === 10) {
                valor = valor.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
            } else if (valor.length > 6) {
                valor = valor.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
            } else if (valor.length > 2) {
                valor = valor.replace(/(\d{2})(\d{0,5})/, '($1) $2');
            } else if (valor.length > 0) {
                valor = valor.replace(/(\d*)/, '($1');
            }
            e.target.value = valor;
        } else {
            e.target.value = e.target.value.slice(0, -1);
        }
    });
    
    telefone.addEventListener('keydown', function() {
        erroTelefone.textContent = '';
    });
    cpf.addEventListener('keydown', function() {
        erroCpf.textContent = '';
    });
    endereco.addEventListener('keydown', function() {
        erroEndereco.textContent = '';
    });
    email.addEventListener('keydown', function() {
        erroEmail.textContent = '';
    });
    senha.addEventListener('keydown', function() {
        erroSenha.textContent = '';
    });
    confirmar.addEventListener('keydown', function() {
        erroConfirmar.textContent = '';
    });

    function validaCPF(cpf) {
        var Soma = 0
        var Resto

        var strCPF = String(cpf).replace(/[^\d]/g, '')
        
        if (strCPF.length !== 11)
            return false
        
        if ([
            '00000000000',
            '11111111111',
            '22222222222',
            '33333333333',
            '44444444444',
            '55555555555',
            '66666666666',
            '77777777777',
            '88888888888',
            '99999999999',
            ].indexOf(strCPF) !== -1)
            return false

        for (i=1; i<=9; i++)
            Soma = Soma + parseInt(strCPF.substring(i-1, i)) * (11 - i);

        Resto = (Soma * 10) % 11

        if ((Resto == 10) || (Resto == 11)) 
            Resto = 0

        if (Resto != parseInt(strCPF.substring(9, 10)) )
            return false

        Soma = 0

        for (i = 1; i <= 10; i++)
            Soma = Soma + parseInt(strCPF.substring(i-1, i)) * (12 - i)

        Resto = (Soma * 10) % 11

        if ((Resto == 10) || (Resto == 11)) 
            Resto = 0

        if (Resto != parseInt(strCPF.substring(10, 11) ) )
            return false

        return true
    }
});
