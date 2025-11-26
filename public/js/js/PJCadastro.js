document.addEventListener('DOMContentLoaded', function(){

    // let voltar = document.getElementById('voltar');
    // let tipo = document.getElementById('tipoItem');
    // tipo.addEventListener('change', function(){
    //     voltar.href = '/admin/listagem/'+tipo.value;
    // })

    const nome = document.getElementById('nomeval');
    const telefone = document.getElementById('telefoneval');
    const cnpj = document.getElementById('cnpjval');
    const endereco = document.getElementById('enderecoval');
    const email = document.getElementById('emailval');
    const senha = document.getElementById('senhaval');
    const senha2 = document.getElementById('senha2val');

    // Mensagens de Erro
    const erroNome = document.getElementById('erro-nome');
    const erroCnpj = document.getElementById('erro-cnpj');
    const erroEndereco = document.getElementById('erro-endereco');
    const erroTelefone = document.getElementById('erro-telefone');
    const erroEmail = document.getElementById('erro-email');
    const erroSenha = document.getElementById('erro-senha');
    const erroSenha2 = document.getElementById('erro-senha2');


    let btn = document.getElementById('cadastrar');
    btn.addEventListener('click', function(){

        // Limpa mensagens anteriores
        erroNome.textContent = '';
        erroCnpj.textContent = '';
        erroEndereco.textContent = '';
        erroTelefone.textContent = '';
        erroEmail.textContent = '';
        erroSenha.textContent = '';
        erroSenha2.textContent = '';

        let valido = true;
        if(!nome.value){
            erroNome.textContent = 'O campo de nome é obrigatório.';
            valido = false;
        }else if(nome.value.length < 10){
            erroNome.textContent = 'Por favor insira o nome completo.';
            valido = false;
        }
        // Validação CNPJ
        if(!cnpj.value){
            erroCnpj.textContent = 'O campo de CNPJ é obrigatório.';
            valido = false;
        }else if(!validaCNPJ(cnpj.value)){
            erroCnpj.textContent = 'Por favor insira um CNPJ válido.';
            valido = false;
        }
        if(!endereco.value){
            erroEndereco.textContent = 'O campo de endereço é obrigatório.';
            valido = false;
        }else if(endereco.value.length < 10){
            erroEndereco.textContent = 'Por favor insira o endereço completo.';
            valido = false;
        }

        // Validação Telefone
        if(!telefone.value){
            erroTelefone.textContent = 'O campo de telefone é obrigatório.';
            valido = false;
        }else if(isNaN(telefone.value) || telefone.value.length!=11 || telefone.value.split(' ').length > 1){
            erroTelefone.textContent = 'Por favor insira um telefone válido.';
            valido = false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        // Validação do e-mail
        if (!email.value) {
            erroEmail.textContent = 'O campo de e-mail é obrigatório.';
            valido = false;
        } else if (!emailRegex.test(email.value)) {
            erroEmail.textContent = 'Digite um e-mail válido.';
            valido = false;
        }

        // Validação da senha
        if (!senha.value) {
            erroSenha.textContent = 'O campo de senha é obrigatório.';
            valido = false;
        } else if (senha.value.length < 6) {
            erroSenha.textContent = 'A senha deve ter pelo menos 6 caracteres.';
            valido = false;
        } else if(senha2.value != senha.value){
            erroSenha2.textContent = 'As senhas não coincidem.';
            valido = false
        }
        if(valido){
            obj = {
                nome: nome.value,
                telefone: telefone.value,
                cnpj: cnpj.value,
                endereco: endereco.value,
                email: email.value,
                senha: senha.value
            }
            fetch('/admin/PJCadastro',{
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
                    let msgfinal = document.getElementById('msg-final');
                    if(corpo.ok){
                        msgfinal.textContent = corpo.msg;
                        msgfinal.classList = 'text-success';
                    }
                    else{
                        msgfinal.textContent = corpo.msg;
                        msgfinal.classList = 'text-danger';
                    }
                })
        }
        else{
            let msgfinal = document.getElementById('msg-final');
            msgfinal.textContent = 'Favor Preencher Corretamente os Campos!';
            msgfinal.classList = 'text-danger';
        }
    });
        // Faz a mensagem de erro sumir ao pressionar qualquer tecla
    nome.addEventListener('keydown', function() {
        erroNome.textContent = '';
    });
    cnpj.addEventListener('keydown', function() {
        erroCnpj.textContent = '';
    });
    endereco.addEventListener('keydown', function() {
        erroEndereco.textContent = '';
    });
    telefone.addEventListener('keydown', function() {
        erroTelefone.textContent = '';
    });
    email.addEventListener('keydown', function() {
        erroEmail.textContent = '';
    });
    senha.addEventListener('keydown', function() {
        erroSenha.textContent = '';
    });

    function validaCNPJ (cnpj) {
        var b = [ 6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2 ]
        var c = String(cnpj).replace(/[^\d]/g, '')
        
        if(c.length !== 14)
            return false

        if(/0{14}/.test(c))
            return false

        for (var i = 0, n = 0; i < 12; n += c[i] * b[++i]);
        if(c[12] != (((n %= 11) < 2) ? 0 : 11 - n))
            return false

        for (var i = 0, n = 0; i <= 12; n += c[i] * b[i++]);
        if(c[13] != (((n %= 11) < 2) ? 0 : 11 - n))
            return false

        return true
    }
})