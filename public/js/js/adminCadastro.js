document.addEventListener('DOMContentLoaded', function(){

  const formulario = document.getElementById('formulario-login');
  const nome = document.getElementById('login-nome');
  const cpf = document.getElementById('login-cpf');
  const telefone = document.getElementById('login-telefone');
  const email = document.getElementById('login-email');
  const senha = document.getElementById('login-senha');
  const senha2 = document.getElementById('login-senha2');
  const erroNome = document.getElementById('erro-nome');
  const erroCpf = document.getElementById('erro-cpf');
  const erroTelefone = document.getElementById('erro-telefone');
  const erroEmail = document.getElementById('erro-email');
  const erroSenha = document.getElementById('erro-senha');
  const erroSenha2 = document.getElementById('erro-senha2');

  formulario.addEventListener('submit', function (e) {
    e.preventDefault();

    // Limpa mensagens anteriores
    erroNome.textContent = '';
    erroCpf.textContent = '';
    erroTelefone.textContent = '';
    erroEmail.textContent = '';
    erroSenha.textContent = '';
    erroSenha2.textContent = '';

    let valido = true;

    // Validação Nome
    if(!nome.value){
      erroNome.textContent = 'O campo de nome é obrigatório.';
      valido = false;
    }else if(nome.value.length < 10){
      erroNome.textContent = 'Por favor insira o nome completo.';
      valido = false;
    }
    // Validação CPF
    if(!cpf.value){
      erroCpf.textContent = 'O campo de CPF é obrigatório.';
      valido = false;
    }else if(!validaCPF(cpf.value)){
      erroCpf.textContent = 'Por favor insira um CPF válido.';
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

    // Se estiver tudo certo
    if (valido) {
      document.getElementById('mensagem-sucesso').style.display = 'block';
      let obj = {
        nome: nome.value,
        cpf: cpf.value,
        telefone: telefone.value,
        email: email.value,
        senha: senha.value,
        tipo: 1
      }
      fetch('/adminLogin/Cadastrar',{
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
              let msgSucesso = document.getElementById('mensagem-sucesso');
              msgSucesso.style.display = 'block';
              msgSucesso.textContent = corpo.msg;
            }
            else{
              let msgErro = document.getElementById('mensagem-erro');
              msgErro.style.display = 'block';
              msgErro.textContent = corpo.msg;
            }
      })
    }
  });

  // Faz a mensagem de erro sumir ao pressionar qualquer tecla
  nome.addEventListener('keydown', function() {
    erroNome.textContent = '';
  });
  cpf.addEventListener('keydown', function() {
    erroCpf.textContent = '';
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
})