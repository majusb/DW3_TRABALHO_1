document.addEventListener('DOMContentLoaded', function() {
    if (!IsLogged()) {
        return;
    }

    var listagem = document.getElementById('emprestimoListagem'); // Obtém o elemento de listagem de empréstimos
    var alertBox = document.getElementById('emprestimoAlert'); // Obtém o elemento de alerta para exibir mensagens de erro ou aviso

    if (!listagem) {
        return;
    }

    // Obtém o endereço do servidor backend a partir do atributo data-servidor-dw3 do elemento de listagem
    var servidorDw3 = listagem.dataset.servidorDw3;

    configurarOperacoesEmprestimo(alertBox); // Configura os eventos de clique nos botões de operação (visualizar, atualizar, remover) da tabela de empréstimos
    carregarEmprestimos(servidorDw3, alertBox); // Carrega a lista de empréstimos do servidor backend e inicializa a tabela de empréstimos
});

async function carregarEmprestimos(servidorDw3, alertBox) {
    try {
        if (!servidorDw3) {
            throw new Error('Endereço do servidor backend não configurado.');
        }

        var response = await fetch(servidorDw3 + '/getAllEmprestimo'); // Faz a requisição para obter todos os empréstimos do servidor backend

        if (!response.ok) {
            throw new Error('Não foi possível carregar a lista de empréstimos.');
        }

        var data = await response.json(); // Converte a resposta em JSON para obter os dados retornados pelo servidor

        if (data.status !== 'ok' || !Array.isArray(data.registro)) { // Verifica se a resposta do servidor é válida e contém a lista de empréstimos
            throw new Error('Resposta inválida do servidor backend.'); // Lança um erro caso a resposta seja inválida
        }

        inicializarTabelaEmprestimos(data.registro); // Inicializa a tabela de empréstimos com os dados obtidos do servidor backend
    } catch (error) {
        exibirErro(alertBox, error.message || 'Erro ao carregar empréstimos.');
        inicializarTabelaEmprestimos([]);
    }
}

function inicializarTabelaEmprestimos(emprestimos) {
    new DataTable('#tblEmprestimos', { // Inicializa a tabela de empréstimos usando a biblioteca DataTables
        data: emprestimos, // Define os dados da tabela como a lista de empréstimos obtida do servidor backend
        columns: [ // Define as colunas da tabela de empréstimos
            { data: 'emprestimoid', defaultContent: '' },
            { data: 'nomepessoa', defaultContent: '' },
            { data: 'endereco', defaultContent: '' },
            { data: 'livroid', defaultContent: '' }, // ou nome do livro se o backend retornar via JOIN
            { 
                data: 'data_emprestimo', 
                defaultContent: '',
                render: function(data) { // Renderiza a data de empréstimo no formato local (pt-BR) se estiver presente, caso contrário retorna uma string vazia
                    if (!data) { return ''; }
                    return new Date(data + 'T00:00:00').toLocaleDateString('pt-BR');
                }
            },
            { 
                data: 'data_devolucao', 
                defaultContent: '',
                render: function(data) { // Renderiza a data de devolução no formato local (pt-BR) se estiver presente, caso contrário retorna uma string vazia
                    if (!data) { return ''; }
                    return new Date(data + 'T00:00:00').toLocaleDateString('pt-BR');
                }
            },
            {
                data: null, // Coluna de operações (visualizar, atualizar, remover) que não está vinculada a um campo específico do objeto de empréstimo
                orderable: false, // Desabilita a ordenação para esta coluna, pois ela contém botões de ação
                searchable: false, // Desabilita a pesquisa para esta coluna, pois ela contém botões de ação
                render: function(data, type, row) {
                    if (type !== 'display') { // Retorna uma string vazia para tipos de renderização que não sejam de exibição (display)
                        return '';
                    }

                    // Obtém o ID do empréstimo a partir do objeto de linha, garantindo que seja escapado para evitar problemas de injeção de HTML
                    var emprestimoId = escaparHtml(row.emprestimoid || row.emprestimoId || '');

                    // Retorna o HTML dos botões de operação (visualizar, atualizar, remover) para cada linha da tabela de empréstimos
                    return [
                        '<div class="btn-group btn-group-sm" role="group" aria-label="Operacoes do emprestimo">',
                        '<button class="btn btn-outline-primary" type="button" data-action="visualizar" data-emprestimoid="' + emprestimoId + '" title="Visualizar" aria-label="Visualizar"><i class="bi bi-eye"></i></button>',
                        '<button class="btn btn-outline-secondary" type="button" data-action="atualizar" data-emprestimoid="' + emprestimoId + '" title="Atualizar" aria-label="Atualizar"><i class="bi bi-pencil-square"></i></button>',
                        '<button class="btn btn-outline-danger" type="button" data-action="remover" data-emprestimoid="' + emprestimoId + '" title="Remover" aria-label="Remover"><i class="bi bi-trash"></i></button>',
                        '</div>'
                    ].join('');
                }
            }
        ],
        // Configurações de idioma para a tabela de empréstimos, incluindo mensagens de vazio, informações de paginação e rótulos dos botões de navegação
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

    // Adiciona um listener de evento de clique na tabela de empréstimos para capturar cliques nos botões de operação (visualizar, atualizar, remover)
    tabela.addEventListener('click', function(event) {
        var botao = event.target.closest('button[data-action][data-emprestimoid]');

        if (!botao) {
            return;
        }

        // Obtém a ação (visualizar, atualizar, remover) e o ID do empréstimo a partir dos atributos data-action e data-emprestimoid do botão clicado
        var action = botao.dataset.action;
        var emprestimoId = botao.dataset.emprestimoid;

        // Redireciona para a página de formulário de empréstimo com a operação correspondente (visualizar, atualizar, remover) e o ID do empréstimo como parâmetro na URL
        if (action === 'visualizar') {
            window.location.href = '/emprestimo/form?oper=Re&emprestimoId=' + encodeURIComponent(emprestimoId);
            return;
        }

        // Redireciona para a página de formulário de empréstimo com a operação correspondente (visualizar, atualizar, remover) e o ID do empréstimo como parâmetro na URL
        if (action === 'atualizar') {
            window.location.href = '/emprestimo/form?oper=Up&emprestimoId=' + encodeURIComponent(emprestimoId);
            return;
        }

        // Redireciona para a página de formulário de empréstimo com a operação correspondente (visualizar, atualizar, remover) e o ID do empréstimo como parâmetro na URL
        if (action === 'remover') {
            window.location.href = '/emprestimo/form?oper=De&emprestimoId=' + encodeURIComponent(emprestimoId);
        }
    });
}

function exibirAviso(alertBox, mensagem) {
    if (!alertBox) {
        return;
    }

    // Exibe uma mensagem de aviso no elemento de alerta, removendo a classe de erro e adicionando a classe de informação
    alertBox.textContent = mensagem;
    alertBox.classList.remove('alert-danger');
    alertBox.classList.add('alert-info');
    alertBox.classList.remove('d-none');
}

// Função para escapar caracteres especiais em uma string para evitar problemas de injeção de HTML
function escaparHtml(valor) {
    return String(valor)
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}

// Função para exibir uma mensagem de erro no elemento de alerta, removendo a classe de informação e adicionando a classe de erro
function exibirErro(alertBox, mensagem) {
    if (!alertBox) {
        return;
    }

    // Exibe uma mensagem de erro no elemento de alerta, removendo a classe de informação e adicionando a classe de erro
    alertBox.textContent = mensagem;
    alertBox.classList.remove('alert-info');
    alertBox.classList.add('alert-danger');
    alertBox.classList.remove('d-none');
}