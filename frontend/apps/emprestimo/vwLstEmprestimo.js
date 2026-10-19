document.addEventListener('DOMContentLoaded', function() {
    if (!dw3IsLogged()) {
        return;
    }

    var listagem = document.getElementById('emprestimoListagem');
    var alertBox = document.getElementById('emprestimoAlert');

    if (!listagem) {
        return;
    }

    var servidorDw3 = listagem.dataset.servidorDw3;

    configurarOperacoesEmprestimo(alertBox);
    carregarEmprestimos(servidorDw3, alertBox);
});

async function carregarEmprestimos(servidorDw3, alertBox) {
    try {
        if (!servidorDw3) {
            throw new Error('Endereço do servidor backend não configurado.');
        }

        var response = await fetch(servidorDw3 + '/getAllEmprestimos');

        if (!response.ok) {
            throw new Error('Não foi possível carregar a lista de empréstimos.');
        }

        var data = await response.json();

        if (data.status !== 'ok' || !Array.isArray(data.registro)) {
            throw new Error('Resposta inválida do servidor backend.');
        }

        inicializarTabelaEmprestimos(data.registro);
    } catch (error) {
        exibirErro(alertBox, error.message || 'Erro ao carregar empréstimos.');
        inicializarTabelaEmprestimos([]);
    }
}

function inicializarTabelaEmprestimos(emprestimos) {
    new DataTable('#tblEmprestimos', {
        data: emprestimos,
        columns: [
            { data: 'emprestimoid', defaultContent: '' },
            { data: 'nomePessoa', defaultContent: '' },
            { data: 'endereco', defaultContent: '' },
            { data: 'livroid', defaultContent: '' }, // ou nome do livro se o backend retornar via JOIN
            { 
                data: 'data_emprestimo', 
                defaultContent: '',
                render: function(data) {
                    if (!data) { return ''; }
                    return new Date(data + 'T00:00:00').toLocaleDateString('pt-BR');
                }
            },
            { 
                data: 'data_devolucao', 
                defaultContent: '',
                render: function(data) {
                    if (!data) { return ''; }
                    return new Date(data + 'T00:00:00').toLocaleDateString('pt-BR');
                }
            },
            {
                data: null,
                orderable: false,
                searchable: false,
                render: function(data, type, row) {
                    if (type !== 'display') {
                        return '';
                    }

                    var emprestimoId = escaparHtml(row.emprestimoid || row.emprestimoId || '');

                    return [
                        '<div class="btn-group btn-group-sm" role="group" aria-label="Operacoes do emprestimo">',
                        '<button class="btn btn-outline-primary" type="button" data-action="visualizar" data-emprestimoId="' + emprestimoId + '" title="Visualizar" aria-label="Visualizar"><i class="bi bi-eye"></i></button>',
                        '<button class="btn btn-outline-secondary" type="button" data-action="atualizar" data-emprestimoId="' + emprestimoId + '" title="Atualizar" aria-label="Atualizar"><i class="bi bi-pencil-square"></i></button>',
                        '<button class="btn btn-outline-danger" type="button" data-action="remover" data-emprestimoId="' + emprestimoId + '" title="Remover" aria-label="Remover"><i class="bi bi-trash"></i></button>',
                        '</div>'
                    ].join('');
                }
            }
        ],
        language: {
            emptyTable: 'Nenhum empréstimo cadastrado.',
            info: 'Mostrando _START_ até _END_ de _TOTAL_ registros',
            infoEmpty: 'Mostrando 0 até 0 de 0 registros',
            infoFiltered: '(filtrado de _MAX_ registros no total)',
            lengthMenu: 'Mostrar _MENU_ registros',
            loadingRecords: 'Carregando...',
            processing: 'Processando...',
            search: 'Pesquisar:',
            zeroRecords: 'Nenhum registro encontrado',
            paginate: {
                first: 'Primeiro',
                last: 'Último',
                next: 'Próximo',
                previous: 'Anterior'
            }
        }
    });
}

// Nome corrigido para bater com a chamada no DOMContentLoaded
function configurarOperacoesEmprestimo(alertBox) {
    var tabela = document.getElementById('tblEmprestimos');

    if (!tabela) {
        return;
    }

    tabela.addEventListener('click', function(event) {
        var botao = event.target.closest('button[data-action][data-emprestimoId]');

        if (!botao) {
            return;
        }

        var action = botao.dataset.action;
        var emprestimoId = botao.dataset.emprestimoId;

        if (action === 'visualizar') {
            window.location.href = '/emprestimos/form?oper=Re&emprestimoId=' + encodeURIComponent(emprestimoId);
            return;
        }

        if (action === 'atualizar') {
            window.location.href = '/emprestimos/form?oper=Up&emprestimoId=' + encodeURIComponent(emprestimoId);
            return;
        }

        if (action === 'remover') {
            window.location.href = '/emprestimos/form?oper=De&emprestimoId=' + encodeURIComponent(emprestimoId);
        }
    });
}

function exibirAviso(alertBox, mensagem) {
    if (!alertBox) {
        return;
    }

    alertBox.textContent = mensagem;
    alertBox.classList.remove('alert-danger');
    alertBox.classList.add('alert-info');
    alertBox.classList.remove('d-none');
}

function escaparHtml(valor) {
    return String(valor)
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}

function exibirErro(alertBox, mensagem) {
    if (!alertBox) {
        return;
    }

    alertBox.textContent = mensagem;
    alertBox.classList.remove('alert-info');
    alertBox.classList.add('alert-danger');
    alertBox.classList.remove('d-none');
}