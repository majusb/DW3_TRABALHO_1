    function IsLogged() {
    const isLogged = document.cookie
        .split(';')
        .some((cookie) => cookie.trim().startsWith('IsLogged='));

    if (!isLogged) {
        window.location.href = '/login';
        return false;
    }

    return true;
    }


    function clearIsLoggedCookie() {
    // Limpa o Cookie Islogged
    var isLogged = document.cookie
        .split(';')
        .some((cookie) => cookie.trim().startsWith('IsLogged='));

    if (isLogged) {
        document.cookie = 'IsLogged=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    }
    }

    function montarHeadersAutenticacao(headers) {
    var token = localStorage.getItem('token');
    var finalHeaders = headers || {};

    if (token) {
        finalHeaders.Authorization = 'Bearer ' + token;
    }

    return finalHeaders;
    }

    function ocultarBotao(id) {
    var botao = document.getElementById(id);

    if (botao) {
        botao.classList.add('d-none');
    }
    }