document.addEventListener('DOMContentLoaded', function(){

    // let voltar = document.getElementById('voltar');
    // let tipo = document.getElementById('tipoItem');
    // tipo.addEventListener('change', function(){
    //     voltar.href = '/admin/listagem/'+tipo.value;
    // })

    const tipo = document.getElementById('tipo');
    const titulo = document.getElementById('titulo');
    const id = document.getElementById('id');
    const nome = document.getElementById('nomeval');
    const telefone = document.getElementById('telefoneval');
    const cpf = document.getElementById('cpfval');
    const cnpj = document.getElementById('cnpjval');
    const cargo = document.getElementById('cargoval');
    const email = document.getElementById('emailval');
    const senha = document.getElementById('senhaval');
    const senha2 = document.getElementById('senha2val');
    
    // Mensagens de Erro
    const erroNome = document.getElementById('erro-nome');
    const erroCpf = document.getElementById('erro-cpf');
    const erroCnpj = document.getElementById('erro-cnpj');
    const erroCargo = document.getElementById('erro-cargo');
    const erroTelefone = document.getElementById('erro-telefone');
    const erroEmail = document.getElementById('erro-email');
    const erroSenha = document.getElementById('erro-senha');
    const erroSenha2 = document.getElementById('erro-senha2');
    
    if(tipo.value == 1){
        titulo.textContent = 'Alterar Pessoa Física';
        cnpj.style.display = 'none';
    }
    if(tipo.value == 2){
        titulo.textContent = 'Alterar Pessoa Jurídica';
        cpf.style.display = 'none';
    }
    if(tipo.value == 3){
        titulo.textContent = 'Alterar Funcionário';
        cnpj.style.display = 'none';
        cargo.style.display = 'block';
    }

    let btn = document.getElementById('cadastrar');
    btn.addEventListener('click', function(){

        // Limpa mensagens anteriores
        erroNome.textContent = '';
        erroCpf.textContent = '';
        erroCnpj.textContent = '';
        erroCargo.textContent = '';
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
        // Validação CPF
        if(tipo.value == 1 || tipo.value == 3){
            if(!cpf.value){
                erroCpf.textContent = 'O campo de CPF é obrigatório.';
                valido = false;
            }else if(!validaCPF(cpf.value)){
                erroCpf.textContent = 'Por favor insira um CPF válido.';
                valido = false;
            }
        }
        if(tipo.value == 2){
            if(!cnpj.value){
                erroCnpj.textContent = 'O campo de CNPJ é obrigatório.';
                valido = false;
            }else if(!validaCNPJ(cnpj.value)){
                erroCnpj.textContent = 'Por favor insira um CNPJ válido.';
                valido = false;
            }
        }
        if(tipo.value == 3){
            if(!cargo.value){
                erroCargo.textContent = 'O campo de Cargo é obrigatório.';
                valido = false;
            }
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
            if(tipo.value == 1){
                obj = {
                    id: id.value,
                    nome: nome.value,
                    telefone: telefone.value,
                    cpf: cpf.value,
                    email: email.value,
                    senha: senha.value
                }
                fetch('/admin/alterarPF',{
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

                        // nome.value='';
                        // telefone.value='';
                        // cpf.value='';
                        // email.value='';
                        // senha.value='';
                    })
            }
            if(tipo.value == 2){
                obj = {
                    id: id.value,
                    nome: nome.value,
                    telefone: telefone.value,
                    cnpj: cnpj.value,
                    email: email.value,
                    senha: senha.value
                }
                fetch('/admin/alterarPJ',{
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

                        // nome.value='';
                        // telefone.value='';
                        // cpf.value='';
                        // email.value='';
                        // senha.value='';
                    })
            }
            if(tipo.value == 3){
                obj = {
                    id: id.value,
                    nome: nome.value,
                    telefone: telefone.value,
                    cpf: cpf.value,
                    email: email.value,
                    senha: senha.value,
                    cargo: cargo.value
                }
                fetch('/admin/alterarFuncionario',{
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

                        // nome.value='';
                        // telefone.value='';
                        // cpf.value='';
                        // email.value='';
                        // senha.value='';
                    })
            }
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
    cpf.addEventListener('keydown', function() {
        erroCpf.textContent = '';
    });
    cnpj.addEventListener('keydown', function() {
        erroCnpj.textContent = '';
    });
    cargo.addEventListener('keydown', function() {
        erroCargo.textContent = '';
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