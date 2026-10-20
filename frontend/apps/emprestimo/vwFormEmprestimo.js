document.addEventListener('DOMContentLoaded', async function() {
    if (!IsLogged()) {
        return;
    }

    var form = document.getElementById('frmEmprestimos');

    if (!form) {
        return;
    }

    var parametros = new URLSearchParams(window.location.search);
    var oper = parametros.get('oper') || parametros.get('Oper');
    var servidorDw3 = form.dataset.servidorDw3;
    var btnInserir = document.getElementById('btnInserirEmprestimo');
    var btnAtualizar = document.getElementById('btnAtualizarEmprestimo');
    var btnRemover = document.getElementById('btnRemoverEmprestimo');

    inicializarSelectLivros();

    if (oper === 'Cr') {
        btnInserir.classList.remove('d-none');
        await carregarLivrosToEmprestimos(servidorDw3);
    }

    if (oper === 'Re') {
        await vwGetEmprestimoByID();
    }

    if (oper === 'Up') {
        btnAtualizar.classList.remove('d-none');
        var carregou = await vwGetEmprestimoByID();
        btnAtualizar.disabled = !carregou;
        
        btnAtualizar.addEventListener('click', function() {
            vwUpdateEmprestimo();
        });
    }

    if (oper === 'De') {
        btnRemover.classList.remove('d-none');
        var carregou = await vwGetEmprestimoByID();
        btnRemover.disabled = !carregou;
        
        btnRemover.addEventListener('click', function() {
            vwDeleteEmprestimo();
        });
    }

    if (btnInserir) {
        btnInserir.addEventListener('click', function() {
            vwInsertEmprestimo();
        });
    }
});

// Inicializa o Select2
function inicializarSelectLivros() {
    $('#livroId').select2({
        theme: 'bootstrap-5',
        placeholder: 'Selecione um livro',
        width: '100%'
    });
}

// Carrega os livros para o Select2
async function carregarLivrosToEmprestimos(servidorDw3) {
    try {
        if (!servidorDw3) {
            throw new Error('Endereço do servidor backend não configurado.');
        }

        var response = await fetch(servidorDw3 + '/getLivroForEmprestimo', {
            headers: montarHeadersAutenticacao()
        });

        if (!response.ok) {
            throw new Error('Não foi possível carregar os livros.');
        }

        var data = await response.json();

        if (data.auth === false) {
            throw new Error(data.message || 'Sessão expirada. Faça login novamente.');
        }

        if (data.status !== 'ok' || !Array.isArray(data.registro)) {
            throw new Error('Resposta inválida do servidor backend.');
        }

        preencherSelectLivros(data.registro);
        return true;
    } catch (error) {
        alert(error.message || 'Erro ao carregar livros.');
        return false;
    }
}

function preencherSelectLivros(livros) {
    var livroSelect = document.getElementById('livroId');

    if (!livroSelect) {
        return;
    }

    livroSelect.innerHTML = '<option value="">Selecione um livro</option>';

    livros.forEach(function(livro) {
        var option = document.createElement('option');
        option.value = livro.livroid; // Ajuste conforme o campo vindo do banco se necessário (livro.livroid ou livro.id)
        option.textContent = livro.nomelivro;
        livroSelect.appendChild(option);
    });

    $('#livroId').trigger('change');
}

// Inserir Empréstimo
async function vwInsertEmprestimo() {
    var form = document.getElementById('frmEmprestimos');
    var btnInserir = document.getElementById('btnInserirEmprestimo');

    try {
        if (!form.reportValidity()) {
            return;
        }

        var servidorDw3 = form.dataset.servidorDw3;

        if (!servidorDw3) {
            throw new Error('Endereço do servidor backend não configurado.');
        }

        if (btnInserir) {
            btnInserir.disabled = true;
        }

        var response = await fetch(servidorDw3 + '/insertEmprestimo', {
            method: 'POST',
            headers: montarHeadersAutenticacao({
                'content-type': 'application/json'
            }),
            body: JSON.stringify(montarEmprestimoDoFormulario())
        });

        if (!response.ok) {
            throw new Error('Não foi possível inserir o empréstimo.');
        }

        var data = await response.json();

        if (data.auth === false) {
            throw new Error(data.message || 'Sessão expirada. Faça login novamente.');
        }

        if (data.status !== 'ok') {
            throw new Error(data.status || 'Não foi possível inserir o empréstimo.');
        }

        window.location.href = '/emprestimo';
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
    var form = document.getElementById('frmEmprestimos');

    try {
        var parametros = new URLSearchParams(window.location.search);
        var emprestimoId = parametros.get('emprestimoId');
        var servidorDw3 = form.dataset.servidorDw3;

        if (!emprestimoId || !/^\d+$/.test(emprestimoId) || Number(emprestimoId) <= 0) {
            throw new Error('ID do empréstimo inválido.');
        }

        if (!servidorDw3) {
            throw new Error('Endereço do servidor backend não configurado.');
        }

        var response = await fetch(servidorDw3 + '/getEmprestimoByID/' + encodeURIComponent(emprestimoId), {
            headers: montarHeadersAutenticacao({
                'content-type': 'application/json'
            })
        });

        if (!response.ok) {
            throw new Error('Não foi possível carregar o empréstimo.');
        }

        var data = await response.json();

        if (data.auth === false) {
            throw new Error(data.message || 'Sessão expirada. Faça login novamente.');
        }

        if (data.status !== 'ok' || !Array.isArray(data.registro)) {
            throw new Error('Resposta inválida do servidor backend.');
        }

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
        
        $('#livroId').val(emprestimo.livroid).trigger('change');
        return true;
    } catch (error) {
        alert(error.message || 'Erro ao carregar empréstimo.');
        return false;
    }
}

// Atualizar Empréstimo
async function vwUpdateEmprestimo() {
    var form = document.getElementById('frmEmprestimos');
    var btnAtualizar = document.getElementById('btnAtualizarEmprestimo');

    if (btnAtualizar.disabled || !form.reportValidity()) {
        return;
    }

    try {
        var emprestimoId = new URLSearchParams(window.location.search).get('emprestimoId');
        var servidorDw3 = form.dataset.servidorDw3;

        if (!emprestimoId || !/^\d+$/.test(emprestimoId) || Number(emprestimoId) <= 0) {
            throw new Error('ID do empréstimo inválido.');
        }

        if (!servidorDw3) {
            throw new Error('Endereço do servidor backend não configurado.');
        }

        btnAtualizar.disabled = true;

        var emprestimo = montarEmprestimoDoFormulario();

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
    var form = document.getElementById('frmEmprestimos');
    var btnRemover = document.getElementById('btnRemoverEmprestimo');

    if (btnRemover.disabled) {
        return;
    }

    if (!window.confirm('Confirma a remoção deste empréstimo?')) {
        return;
    }

    try {
        var emprestimoId = document.getElementById('emprestimoId').value;
        var servidorDw3 = form.dataset.servidorDw3;

        if (!emprestimoId || !/^\d+$/.test(emprestimoId) || Number(emprestimoId) <= 0) {
            throw new Error('ID do empréstimo inválido.');
        }

        if (!servidorDw3) {
            throw new Error('Endereço do servidor backend não configurado.');
        }

        btnRemover.disabled = true;

        var response = await fetch(servidorDw3 + '/deleteEmprestimo/' + encodeURIComponent(emprestimoId), {
            method: 'DELETE',
            headers: montarHeadersAutenticacao()
        });

        if (!response.ok) {
            throw new Error('Não foi possível remover o empréstimo.');
        }

        var data = await response.json();

        if (data.auth === false) {
            throw new Error(data.message || 'Sessão expirada. Faça login novamente.');
        }

        if (data.status !== 'ok') {
            throw new Error(data.status || 'Não foi possível remover o empréstimo.');
        }

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