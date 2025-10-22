
  const formulario = document.getElementById('formulario-login');
  const email = document.getElementById('login-email');
  const senha = document.getElementById('login-senha');
  const erroEmail = document.getElementById('erro-email');
  const erroSenha = document.getElementById('erro-senha');

  formulario.addEventListener('submit', function (e) {
    e.preventDefault();

    // Limpa mensagens anteriores
    erroEmail.textContent = '';
    erroSenha.textContent = '';

    let valido = true;
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
    if (!senha.value){
      erroSenha.textContent = 'O campo de senha é obrigatório.';
      valido = false;
    } else if (senha.value.length < 6) {
      erroSenha.textContent = 'A senha deve ter pelo menos 6 caracteres.';
      valido = false;
    }

    // Se estiver tudo certo
    if (valido) {
      let obj = {
        email: email.value,
        senha: senha.value
      }
      fetch('/adminLogin',{
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
            if(corpo.ok){
              //redireciona para admin
              window.location.replace('http://localhost:5550/admin')
            }
            else{
              let msgErro = document.getElementById('mensagem-erro');
              msgErro.style.display = 'block'
            }
      })
    }
  });

  // Faz a mensagem de erro sumir ao pressionar qualquer tecla
  email.addEventListener('keydown', function() {
    erroEmail.textContent = '';
  });

  senha.addEventListener('keydown', function() {
    erroSenha.textContent = '';
  });