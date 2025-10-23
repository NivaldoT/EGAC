
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
    if (!email.value.trim()) {
      erroEmail.textContent = 'O campo de e-mail é obrigatório.';
      valido = false;
    } else if (!emailRegex.test(email.value)) {
      erroEmail.textContent = 'Digite um e-mail válido.';
      valido = false;
    }

    // Validação da senha
    if (!senha.value.trim()) {
      erroSenha.textContent = 'O campo de senha é obrigatório.';
      valido = false;
    } else if (senha.value.length < 6) {
      erroSenha.textContent = 'A senha deve ter pelo menos 6 caracteres.';
      valido = false;
    }

    // Se estiver tudo certo
    if (valido) {
      document.getElementById('mensagem-sucesso').style.display = 'block';
    }
  });

  // Faz a mensagem de erro sumir ao pressionar qualquer tecla
  email.addEventListener('keydown', function() {
    erroEmail.textContent = '';
  });

  senha.addEventListener('keydown', function() {
    erroSenha.textContent = '';
  });


  let usuariosLogados = [];

function montarTabelaLogin() {
  const tbody = document.querySelector('#tb-body');
  let html = '';
  for (let u of usuariosLogados) {
    html += `
      <tr>
        <td><input type="checkbox" data-id="${u.id}"></td>
        <td>${u.email}</td>
        <td><a href="#" onclick="excluirUsuario(${u.id})">&#9746;</a></td>
      </tr>`;
  }
  tbody.innerHTML = html;
}

function adicionarLogin(email) {
  const novo = {
    id: new Date().getTime(),
    email: email
  };
  usuariosLogados.push(novo);
  montarTabelaLogin();
}

function excluirUsuario(idDelete) {
  usuariosLogados = usuariosLogados.filter(u => u.id != idDelete);
  montarTabelaLogin();
}

function excluirSelecionadosLogin() {
  const checkboxes = document.querySelectorAll('[data-id]');
  for (let ck of checkboxes) {
    if (ck.checked) {
      excluirUsuario(Number(ck.dataset.id));
    }
  }
}

function selecionaTodosLogin() {
  const checkboxes = document.querySelectorAll('[data-id]');
  const ckPai = document.querySelector('#ckTodos');
  for (let ck of checkboxes) {
    ck.checked = ckPai.checked;
  }
}

  document.addEventListener('DOMContentLoaded', function () {
    document.querySelector('#ckTodos').addEventListener('click', selecionaTodosLogin);
    document.querySelector('#btnExcluirSelecionados').addEventListener('click', excluirSelecionadosLogin);

    document.querySelector('#formulario-login').addEventListener('submit', function (e) {
      e.preventDefault();

      const email = document.querySelector('#login-email').value.trim();
      const senha = document.querySelector('#login-senha').value.trim();

      if (email !== '' && senha !== '') {
        adicionarLogin(email);
        this.reset();
        document.querySelector('#mensagem-sucesso').style.display = 'block';
        setTimeout(() => {
          document.querySelector('#mensagem-sucesso').style.display = 'none';
        }, 3000);
      }
    });
  });