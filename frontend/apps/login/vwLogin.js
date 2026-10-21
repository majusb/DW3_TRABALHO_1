document.addEventListener('DOMContentLoaded', function() {
  // Limpa o Cookie Islogged
    clearIsLoggedCookie();


    var form = document.getElementById('loginForm');
    var errorBox = document.getElementById('loginError');

    if (!form) {
        return;
    }

    // Submete os dados de Login
    form.addEventListener('submit', async function(event) {
        event.preventDefault();

        var servidorTrabalho = form.dataset.servidorTrabalho
        var usuario = document.getElementById('usuario').value;
        var senha = document.getElementById('senha').value;
        var submitButton = form.querySelector('button[type="submit"]');

        // Limpa mensagens de erro e desabilita o botão de envio
        if (errorBox) {
        errorBox.classList.add('d-none');
        errorBox.textContent = '';
        }

        // Desabilita o botão de envio e altera o texto para indicar que o login está em andamento
        if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = 'Entrando...';
        }

        // Faz a requisição de login para o servidor
        try {
        var response = await fetch(servidorTrabalho + '/Login', {
            method: 'POST',
            headers: {
            'content-type': 'application/json'
            },
            body: JSON.stringify({
            username: usuario,
            password: senha
            })
        });

        // Verifica se a resposta do servidor foi bem-sucedida
        if (!response.ok) {
            throw new Error('Usuário ou senha inválidos.');
        }

        // Obtém o token de autenticação da resposta do servidor
        var data = await response.json();
        var token = data.token || data.Token || data.accessToken || data.AccessToken;

        if (!token) {
            throw new Error('Token não retornado pelo servidor.');
        }

        // Armazena o token no localStorage e define o cookie IsLogged para indicar que o usuário está logado
        localStorage.setItem('token', token);
        document.cookie = 'IsLogged=true; path=/'; // Usado para verificar se o usuário está ou não logado.

        // Redireciona o usuário para a página inicial após o login bem-sucedido
        window.location.href = '/home';
        } catch (error) {
        if (errorBox) {
            errorBox.textContent = error.message || 'Nao foi possivel realizar o login.';
            errorBox.classList.remove('d-none');
        }
        } finally { // Reabilita o botão de envio e restaura o texto original
        if (submitButton) {
            submitButton.disabled = false;
            submitButton.textContent = 'Entrar';
        }
        }
    });
});