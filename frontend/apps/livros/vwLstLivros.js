// Arquivo: apps/livros/vwLstLivros.js

document.addEventListener('DOMContentLoaded', function() {
  if (!IsLogged()) {
    return;
  }

  var listagem = document.getElementById('livrosListagem');
  var alertBox = document.getElementById('livrosAlert');

  if (!listagem) {
    return;
  }

  var servidorTrabalho = listagem.dataset.servidorTrabalho;

  configurarOperacoesLivros(alertBox);
  carregarLivros(servidorTrabalho, alertBox);
});

async function carregarLivros(servidorTrabalho, alertBox) {
  try {
    if (!servidorTrabalho) {
      throw new Error('Endereco do servidor backend nao configurado.');
    }

    var response = await fetch(servidorTrabalho + '/getAllLivros', {
      headers: montarHeadersAutenticacao()
    });

    if (!response.ok) {
      throw new Error('Nao foi possivel carregar a lista de livros.');
    }

    var data = await response.json();

    if (data.auth === false) {
      throw new Error(data.message || 'Sessao expirada. Faca login novamente.');
    }

    if (data.status !== 'ok' || !Array.isArray(data.registro)) {
      throw new Error('Resposta invalida do servidor backend.');
    }

    inicializarTabelaLivros(data.registro);
  } catch (error) {
    exibirErroLivro(alertBox, error.message || 'Erro ao carregar livros.');
    inicializarTabelaLivros([]);
  }
}

function inicializarTabelaLivros(livros) {
  new DataTable('#tblLivros', {
    data: livros,
    columns: [
      { data: 'livroid', defaultContent: '' },
      { data: 'nomelivro', defaultContent: '' },
      { data: 'autor', defaultContent: '' },
      { data: 'genero', defaultContent: '' },
      {
        data: 'valor',
        defaultContent: '',
        render: function(data) {
          if (data === null || data === undefined || data === '') {
            return '';
          }

          return Number(data).toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
          });
        }
      },
      {
        data: 'status',
        defaultContent: '',
        render: function(data) {
          return data === true ? 'Sim' : 'Nao';
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

          var livroId = escaparHtmlLivro(row.livroid || '');

          return [
            '<div class="btn-group btn-group-sm" role="group" aria-label="Operacoes do livro">',
            '<button class="btn btn-outline-primary" type="button" data-action="visualizar" data-livroid="' + livroId + '" title="Visualizar" aria-label="Visualizar"><i class="bi bi-eye"></i></button>',
            '<button class="btn btn-outline-secondary" type="button" data-action="atualizar" data-livroid="' + livroId + '" title="Atualizar" aria-label="Atualizar"><i class="bi bi-pencil-square"></i></button>',
            '<button class="btn btn-outline-danger" type="button" data-action="remover" data-livroid="' + livroId + '" title="Remover" aria-label="Remover"><i class="bi bi-trash"></i></button>',
            '</div>'
          ].join('');
        }
      }
    ],
    language: {
      emptyTable: 'Nenhum livro cadastrado.',
      info: 'Mostrando _START_ ate _END_ de _TOTAL_ registros',
      infoEmpty: 'Mostrando 0 ate 0 de 0 registros',
      infoFiltered: '(filtrado de _MAX_ registros no total)',
      lengthMenu: 'Mostrar _MENU_ registros',
      loadingRecords: 'Carregando...',
      processing: 'Processando...',
      search: 'Pesquisar:',
      zeroRecords: 'Nenhum registro encontrado',
      paginate: {
        first: 'Primeiro',
        last: 'Ultimo',
        next: 'Proximo',
        previous: 'Anterior'
      }
    }
  });
}

function configurarOperacoesLivros(alertBox) {
  var tabela = document.getElementById('tblLivros');

  if (!tabela) {
    return;
  }

  tabela.addEventListener('click', function(event) {
    var botao = event.target.closest('button[data-action][data-livroid]');

    if (!botao) {
      return;
    }

    var action = botao.dataset.action;
    var livroId = botao.dataset.livroid;

    if (action === 'visualizar') {
      window.location.href = '/livro/form?oper=Re&livroId=' + encodeURIComponent(livroId);
      return;
    }

    if (action === 'atualizar') {
      window.location.href = '/livro/form?oper=Up&livroId=' + encodeURIComponent(livroId);
      return;
    }

    if (action === 'remover') {
      window.location.href = '/livro/form?oper=De&livroId=' + encodeURIComponent(livroId);
    }
  });
}

function escaparHtmlLivro(valor) {
  return String(valor)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function exibirErroLivro(alertBox, mensagem) {
  if (!alertBox) {
    return;
  }

  alertBox.textContent = mensagem;
  alertBox.classList.remove('d-none');
}
