document.addEventListener('DOMContentLoaded', function(){

  const formulario = document.getElementById('formulario-login');
  const email = document.getElementById('login-email');
  const senha = document.getElementById('login-senha');
  const erroEmail = document.getElementById('erro-email');
  const erroSenha = document.getElementById('erro-senha');

  formulario.addEventListener('submit', function (e) {
    e.preventDefault();

    erroEmail.textContent = '';
    erroSenha.textContent = '';

    let valido = true;
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
    }

    if (valido) {
      let obj = {
        email: email.value,
        senha: senha.value
      }
      fetch('/usuario/login',{
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(obj)
        })
        .then(function(resposta) {
            return resposta.json();
        })
        .then(function(corpo) {
            if(corpo.ok){
              showToast('Sucesso!', corpo.msg, 'success');
              setTimeout(function(){
                window.location.href = '/';
              }, 1000);
            }
            else{
              showToast('Erro!', corpo.msg, 'error');
            }
      })
    }
  });

  email.addEventListener('keydown', function() {
    erroEmail.textContent = '';
  });
  senha.addEventListener('keydown', function() {
    erroSenha.textContent = '';
  });

  function showToast(title, message, type) {
    const toast = document.createElement('div');
    toast.className = `toast-notification ${type}`;
    const icon = type === 'success' ? '✓' : '✕';
    toast.innerHTML = `
        <div class="toast-icon">${icon}</div>
        <div class="toast-content">
            <div class="toast-title">${title}</div>
            <div class="toast-message">${message}</div>
        </div>
        <button class="toast-close" onclick="this.parentElement.remove()">×</button>
    `;
    document.body.appendChild(toast);
    setTimeout(() => {
        toast.classList.add('hiding');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

});
