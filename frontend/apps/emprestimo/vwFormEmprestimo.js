document.addEventListener('DOMContentLoaded', async function() {
    if (!IsLogged()) {
        return;
    }

    // Verifica se o formulário existe na página
    var form = document.getElementById('frmEmprestimos');

    if (!form) {
        return;
    }

// Obtém os parâmetros da URL para determinar a operação (Cr, Re, Up, De)
    var parametros = new URLSearchParams(window.location.search);
    var oper = parametros.get('oper') || parametros.get('Oper');
    var servidorDw3 = form.dataset.servidorDw3;

// Obtém os botões de ação do formulário
    var btnInserir = document.getElementById('btnInserirEmprestimo');
    var btnAtualizar = document.getElementById('btnAtualizarEmprestimo');
    var btnRemover = document.getElementById('btnRemoverEmprestimo');

    inicializarSelectLivros();

    if (oper === 'Cr') {
        btnInserir.classList.remove('d-none'); // Exibe o botão de inserção para a operação de criação
        await carregarLivrosToEmprestimos(servidorDw3);
    }

    if (oper === 'Re') {
        await vwGetEmprestimoByID(); // Carrega os dados do empréstimo para a operação de leitura
    }

    if (oper === 'Up') {
        btnAtualizar.classList.remove('d-none'); // Exibe o botão de atualização para a operação de atualização
        var carregou = await vwGetEmprestimoByID(); // Carrega os dados do empréstimo para a operação de atualização
        btnAtualizar.disabled = !carregou; // Desabilita o botão de atualização se não conseguiu carregar os dados
        
        btnAtualizar.addEventListener('click', function() {
            vwUpdateEmprestimo();
        });
    }

    if (oper === 'De') {
        btnRemover.classList.remove('d-none'); // Exibe o botão de remoção para a operação de exclusão
        var carregou = await vwGetEmprestimoByID(); // Carrega os dados do empréstimo para a operação de exclusão
        btnRemover.disabled = !carregou; // Desabilita o botão de remoção se não conseguiu carregar os dados
        
        btnRemover.addEventListener('click', function() {
            vwDeleteEmprestimo();
        });
    }

    if (btnInserir) {
        btnInserir.addEventListener('click', function() { // Adiciona o evento de clique para o botão de inserção
            vwInsertEmprestimo();
        });
    }
});

// Inicializa o Select2
function inicializarSelectLivros() {
    $('#livroId').select2({ // Inicializa o Select2 para o campo de seleção de livros
        theme: 'bootstrap-5', // Define o tema do Select2 como Bootstrap 5
        placeholder: 'Selecione um livro', // Define o texto de placeholder para o Select2
        width: '100%' // Define a largura do Select2 como 100% do contêiner
    });
}

// Carrega os livros para o Select2
async function carregarLivrosToEmprestimos(servidorDw3) {
    try {
        if (!servidorDw3) { // Verifica se o endereço do servidor backend está configurado
            throw new Error('Endereço do servidor backend não configurado.');
        }

        // Faz a requisição para obter os livros disponíveis para empréstimo
        var response = await fetch(servidorDw3 + '/getLivroForEmprestimo', {
            headers: montarHeadersAutenticacao()
        });

        if (!response.ok) {
            throw new Error('Não foi possível carregar os livros.');
        }

        var data = await response.json(); // Converte a resposta em JSON

        if (data.auth === false) {
            throw new Error(data.message || 'Sessão expirada. Faça login novamente.');
        }

        if (data.status !== 'ok' || !Array.isArray(data.registro)) {
            throw new Error('Resposta inválida do servidor backend.');
        }

        preencherSelectLivros(data.registro); // Preenche o Select2 com os livros obtidos do servidor
        return true;
    } catch (error) {
        alert(error.message || 'Erro ao carregar livros.');
        return false;
    }
}

function preencherSelectLivros(livros) {
    var livroSelect = document.getElementById('livroId'); // Obtém o elemento select para os livros

    if (!livroSelect) {
        return;
    }

    // Limpa as opções existentes no select antes de preenchê-lo novamente
    livroSelect.innerHTML = '<option value="">Selecione um livro</option>';

    // Adiciona as opções de livros ao select
    livros.forEach(function(livro) {
        var option = document.createElement('option'); // Cria um novo elemento option para cada livro
        option.value = livro.livroid; // Define o valor do option como o ID do livro
        option.textContent = livro.nomelivro; // Define o texto do option como o nome do livro
        livroSelect.appendChild(option); // Adiciona o option ao select
    });

    $('#livroId').trigger('change'); // Atualiza o Select2 para refletir as novas opções adicionadas
}

// Inserir Empréstimo
async function vwInsertEmprestimo() {
    var form = document.getElementById('frmEmprestimos'); // Obtém o formulário de empréstimos
    var btnInserir = document.getElementById('btnInserirEmprestimo'); // Obtém o botão de inserção de empréstimos

    try {
        if (!form.reportValidity()) { // Verifica se o formulário é válido antes de prosseguir
            return;
        }

        var servidorDw3 = form.dataset.servidorDw3; // Obtém o endereço do servidor backend a partir do atributo data-servidor-dw3 do formulário

        if (!servidorDw3) {
            throw new Error('Endereço do servidor backend não configurado.');// Lança um erro se o endereço do servidor backend não estiver configurado
        }

        if (btnInserir) {
            btnInserir.disabled = true; // Desabilita o botão de inserção para evitar múltiplos cliques enquanto a requisição está em andamento
        }

        var response = await fetch(servidorDw3 + '/insertEmprestimo', { // Faz a requisição para inserir um novo empréstimo no servidor backend
            method: 'POST', // Define o método HTTP como POST para inserir um novo empréstimo
            headers: montarHeadersAutenticacao({ // Monta os cabeçalhos de autenticação para a requisição, incluindo o tipo de conteúdo como JSON
                'content-type': 'application/json'
            }),
            body: JSON.stringify(montarEmprestimoDoFormulario())// Converte os dados do formulário em JSON e os envia no corpo da requisição
        });

        if (!response.ok) { // Verifica se a resposta da requisição não foi bem-sucedida
            throw new Error('Não foi possível inserir o empréstimo.');
        }

        var data = await response.json(); // Converte a resposta em JSON para obter os dados retornados pelo servidor

        if (data.auth === false) { // Verifica se a autenticação falhou, indicando que a sessão expirou
            throw new Error(data.message || 'Sessão expirada. Faça login novamente.');
        }

        if (data.status !== 'ok') { // Verifica se o status da resposta não é "ok", indicando que houve um erro ao inserir o empréstimo
            throw new Error(data.status || 'Não foi possível inserir o empréstimo.');
        }

        window.location.href = '/emprestimo'; // Redireciona o usuário para a página de listagem de empréstimos após a inserção bem-sucedida
    } catch (error) {
        alert(error.message || 'Erro ao inserir empréstimo.');
    } finally {
        if (btnInserir) {
            btnInserir.disabled = false;
        }
    }
}

// Buscar Empréstimo por ID
async function vwGetEmprestimoByID() {
    var form = document.getElementById('frmEmprestimos'); // Obtém o formulário de empréstimos

    try {
        var parametros = new URLSearchParams(window.location.search); // Obtém os parâmetros da URL para determinar a operação (Cr, Re, Up, De)
        var emprestimoId = parametros.get('emprestimoId'); // Obtém o ID do empréstimo a partir dos parâmetros da URL
        var servidorDw3 = form.dataset.servidorDw3; // Obtém o endereço do servidor backend a partir do atributo data-servidor-dw3 do formulário

        // Valida o ID do empréstimo para garantir que seja um número positivo
        if (!emprestimoId || !/^\d+$/.test(emprestimoId) || Number(emprestimoId) <= 0) {
            throw new Error('ID do empréstimo inválido.');
        }

        //  Verifica se o endereço do servidor backend está configurado
        if (!servidorDw3) {
            throw new Error('Endereço do servidor backend não configurado.');
        }

        // Faz a requisição para obter os dados do empréstimo pelo ID
        var response = await fetch(servidorDw3 + '/getEmprestimoByID/' + encodeURIComponent(emprestimoId), {
            headers: montarHeadersAutenticacao({ // Monta os cabeçalhos de autenticação para a requisição, incluindo o tipo de conteúdo como JSON
                'content-type': 'application/json'
            })
        });

        if (!response.ok) {
            throw new Error('Não foi possível carregar o empréstimo.');
        }

        // Converte a resposta em JSON para obter os dados retornados pelo servidor
        var data = await response.json();

        if (data.auth === false) {
            throw new Error(data.message || 'Sessão expirada. Faça login novamente.');
        }

        if (data.status !== 'ok' || !Array.isArray(data.registro)) {
            throw new Error('Resposta inválida do servidor backend.');
        }

        // Obtém o primeiro registro do empréstimo retornado pelo servidor
        var emprestimo = data.registro[0];

        if (!emprestimo) {
            throw new Error('Empréstimo não encontrado.');
        }

        // Preenche os campos corretamente com base no HTML de Empréstimos
        document.getElementById('emprestimoId').value = emprestimo.emprestimoid;
        document.getElementById('nomePessoa').value = emprestimo.nomepessoa || '';
        document.getElementById('endereco').value = emprestimo.endereco || '';
        document.getElementById('data_emprestimo').value = emprestimo.data_emprestimo ? emprestimo.data_emprestimo.slice(0, 10) : '';
        document.getElementById('data_devolucao').value = emprestimo.data_devolucao ? emprestimo.data_devolucao.slice(0, 10) : '';
        document.getElementById('deleted').value = String(emprestimo.deleted === true);

        // Carrega os livros e seleciona o livro correspondente
        if (!(await carregarLivrosToEmprestimos(servidorDw3))) {
            return false;
        }
        
        // Seleciona o livro correspondente no Select2
        $('#livroId').val(emprestimo.livroid).trigger('change');
        return true;
    } catch (error) {
        alert(error.message || 'Erro ao carregar empréstimo.');
        return false;
    }
}

// Atualizar Empréstimo
async function vwUpdateEmprestimo() {
    var form = document.getElementById('frmEmprestimos'); // Obtém o formulário de empréstimos
    var btnAtualizar = document.getElementById('btnAtualizarEmprestimo'); // Obtém o botão de atualização de empréstimos

    if (btnAtualizar.disabled || !form.reportValidity()) {
        return;
    }

    // Valida o formulário antes de prosseguir com a atualização
    try {
        var emprestimoId = new URLSearchParams(window.location.search).get('emprestimoId'); // Obtém o ID do empréstimo a partir dos parâmetros da URL
        var servidorDw3 = form.dataset.servidorDw3; // Obtém o endereço do servidor backend a partir do atributo data-servidor-dw3 do formulário

        // Valida o ID do empréstimo para garantir que seja um número positivo
        if (!emprestimoId || !/^\d+$/.test(emprestimoId) || Number(emprestimoId) <= 0) {
            throw new Error('ID do empréstimo inválido.');
        }

        // Verifica se o endereço do servidor backend está configurado
        if (!servidorDw3) {
            throw new Error('Endereço do servidor backend não configurado.');
        }

        // Desabilita o botão de atualização para evitar múltiplos cliques enquanto a requisição está em andamento
        btnAtualizar.disabled = true;

        // Monta o objeto JSON com os dados do formulário para enviar na requisição de atualização
        var emprestimo = montarEmprestimoDoFormulario();

        // Faz a requisição para atualizar o empréstimo no servidor backend
        var response = await fetch(servidorDw3 + '/updateEmprestimo/' + encodeURIComponent(emprestimoId), {
            method: 'PUT',
            headers: montarHeadersAutenticacao({
                'content-type': 'application/json'
            }),
            body: JSON.stringify(emprestimo)
        });

        if (!response.ok) {
            throw new Error('Não foi possível atualizar o empréstimo.');
        }

        var data = await response.json();

        if (data.auth === false) {
            throw new Error(data.message || 'Sessão expirada. Faça login novamente.');
        }

        if (data.status !== 'ok') {
            throw new Error(data.status || 'Não foi possível atualizar o empréstimo.');
        }

        alert('Empréstimo atualizado com sucesso.');
        window.location.href = '/emprestimo';
    } catch (error) {
        alert(error.message || 'Erro ao atualizar empréstimo.');
    } finally {
        btnAtualizar.disabled = false;
    }
}

// Deletar Empréstimo
async function vwDeleteEmprestimo() {
    var form = document.getElementById('frmEmprestimos'); // Obtém o formulário de empréstimos
    var btnRemover = document.getElementById('btnRemoverEmprestimo'); // Obtém o botão de remoção de empréstimos

    if (btnRemover.disabled) { //   Verifica se o botão de remoção está desabilitado para evitar múltiplos cliques
        return;
    }

    if (!window.confirm('Confirma a remoção deste empréstimo?')) {
        return;
    }

    try {
        var emprestimoId = document.getElementById('emprestimoId').value; // Obtém o ID do empréstimo a partir do campo de entrada do formulário
        var servidorDw3 = form.dataset.servidorDw3; // Obtém o endereço do servidor backend a partir do atributo data-servidor-dw3 do formulário

        // Valida o ID do empréstimo para garantir que seja um número positivo
        if (!emprestimoId || !/^\d+$/.test(emprestimoId) || Number(emprestimoId) <= 0) {
            throw new Error('ID do empréstimo inválido.');
        }

        if (!servidorDw3) {
            throw new Error('Endereço do servidor backend não configurado.');
        }

        // Desabilita o botão de remoção para evitar múltiplos cliques enquanto a requisição está em andamento
        btnRemover.disabled = true;

        // Faz a requisição para remover o empréstimo no servidor backend
        var response = await fetch(servidorDw3 + '/deleteEmprestimo/' + encodeURIComponent(emprestimoId), {
            method: 'DELETE',
            headers: montarHeadersAutenticacao()
        });

        if (!response.ok) {
            throw new Error('Não foi possível remover o empréstimo.');
        }

        // Converte a resposta em JSON para obter os dados retornados pelo servidor
        var data = await response.json();

        if (data.auth === false) {
            throw new Error(data.message || 'Sessão expirada. Faça login novamente.');
        }

        if (data.status !== 'ok') {
            throw new Error(data.status || 'Não foi possível remover o empréstimo.');
        }

        // Exibe uma mensagem de sucesso e redireciona o usuário para a página de listagem de empréstimos após a remoção bem-sucedida
        window.location.href = '/emprestimo';
    } catch (error) {
        alert(error.message || 'Erro ao remover empréstimo.');
    } finally {
        btnRemover.disabled = false;
    }
}

// Monta o objeto JSON vindo do formulário
function montarEmprestimoDoFormulario() {
    return {
        emprestimoId: document.getElementById('emprestimoId').value,
        nomePessoa: document.getElementById('nomePessoa').value,
        endereco: document.getElementById('endereco').value,
        livroId: document.getElementById('livroId').value,
        data_emprestimo: document.getElementById('data_emprestimo').value,
        data_devolucao: document.getElementById('data_devolucao').value,
        deleted: document.getElementById('deleted').value === 'true'
    };
}