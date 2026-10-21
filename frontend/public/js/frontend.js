    function IsLogged() {
    const isLogged = document.cookie // Obtém os cookies do documento
        .split(';') // Divide os cookies por ponto e vírgula
        .some((cookie) => cookie.trim().startsWith('IsLogged=')); // Verifica se o cookie IsLogged existe

        // Se o cookie IsLogged não existir, redireciona para a página de login e retorna false
    if (!isLogged) {
        window.location.href = '/login';
        return false;
    }

    return true;
    }


    function clearIsLoggedCookie() {
    // Limpa o Cookie Islogged
    var isLogged = document.cookie // Obtém os cookies do documento
        .split(';') // Divide os cookies por ponto e vírgula
        .some((cookie) => cookie.trim().startsWith('IsLogged=')); // Verifica se o cookie IsLogged existe

    // Se o cookie IsLogged existir, remove o cookie definindo sua data de expiração para uma data passada
    if (isLogged) {
        document.cookie = 'IsLogged=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    }

    // Tira tambem o token do localStorage, senao ele continua guardado depois de sair
    localStorage.removeItem('token');
    }

    // Função para montar os headers de autenticação, adicionando o token do localStorage ao header Authorization, se existir
    function montarHeadersAutenticacao(headers) {
    var token = localStorage.getItem('token');
    var finalHeaders = headers || {};

    // Se o token existir, adiciona o header Authorization com o valor 'Bearer
    if (token) {
        finalHeaders.Authorization = 'Bearer ' + token;
    }

    return finalHeaders;
    }

    // Função para ocultar um botão com base no ID fornecido, adicionando a classe 'd-none' ao elemento do botão
    function ocultarBotao(id) {
    var botao = document.getElementById(id);

    // Se o botão existir, adiciona a classe 'd-none' para ocultá-lo
    if (botao) {
        botao.classList.add('d-none');
    }
    }