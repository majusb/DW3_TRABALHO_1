// Arquivo: apps/livros/vwFormLivros.js
// Modos pela querystring: Cr = cadastrar, Re = visualizar, Up = atualizar, De = remover.

document.addEventListener('DOMContentLoaded', async function() {
  if (!IsLogged()) {
    return;
  }

  var form = document.getElementById('frmLivros');

  if (!form) {
    return;
  }

  var oper = new URLSearchParams(window.location.search).get('oper');
  var btnInserir = document.getElementById('btnInserirLivro');
  var btnAtualizar = document.getElementById('btnAtualizarLivro');

  if (oper === 'Cr') {
    btnInserir.classList.remove('d-none'); // Torna o Botao visivel.
  }

  if (oper === 'Re') {
    vwGetLivroByID();
  }

  if (oper === 'Up') {
    btnAtualizar.classList.remove('d-none');
    btnAtualizar.disabled = !(await vwGetLivroByID()); // so habilita se o livro carregou
    btnAtualizar.addEventListener('click', function() {
      vwUpdateLivro();
    });
  }

  if (oper === 'De') {
    var btnRemover = document.getElementById('btnRemoverLivro');
    btnRemover.classList.remove('d-none');
    btnRemover.disabled = !(await vwGetLivroByID());
    btnRemover.addEventListener('click', function() {
      vwDeleteLivro();
    });
  }

  if (btnInserir) {
    btnInserir.addEventListener('click', function() {
      vwInsertLivro();
    });
  }
});

//-- CREATE
async function vwInsertLivro() {
  var form = document.getElementById('frmLivros');
  var btnInserir = document.getElementById('btnInserirLivro');

  try {
    if (!form.reportValidity()) {
      return;
    }

    var servidorTrabalho = form.dataset.servidorTrabalho;

    if (!servidorTrabalho) {
      throw new Error('Endereco do servidor backend nao configurado.');
    }

    btnInserir.disabled = true;

    var response = await fetch(servidorTrabalho + '/insertLivro', {
      method: 'POST',
      headers: montarHeadersAutenticacao({
        'content-type': 'application/json'
      }),
      body: JSON.stringify(montarLivroDoFormulario())
    });

    if (!response.ok) {
      throw new Error('Nao foi possivel inserir o livro.');
    }

    var data = await response.json();

    if (data.auth === false) {
      throw new Error(data.message || 'Sessao expirada. Faca login novamente.');
    }

    if (data.status !== 'ok') {
      throw new Error(data.status || 'Nao foi possivel inserir o livro.');
    }

    window.location.href = '/livro';
  } catch (error) {
    alert(error.message || 'Erro ao inserir livro.');
  } finally {
    btnInserir.disabled = false;
  }
}

//-- READ: busca o livro pelo id da URL e preenche o formulario
async function vwGetLivroByID() {
  var form = document.getElementById('frmLivros');

  try {
    var livroId = new URLSearchParams(window.location.search).get('livroId');
    var servidorTrabalho = form.dataset.servidorTrabalho;

    if (!livroId || !/^\d+$/.test(livroId) || Number(livroId) <= 0) {
      throw new Error('ID do livro invalido.');
    }

    if (!servidorTrabalho) {
      throw new Error('Endereco do servidor backend nao configurado.');
    }

    var response = await fetch(servidorTrabalho + '/getLivroByID/' + encodeURIComponent(livroId), {
      headers: montarHeadersAutenticacao({
        'content-type': 'application/json'
      })
    });

    if (!response.ok) {
      throw new Error('Nao foi possivel carregar o livro.');
    }

    var data = await response.json();

    if (data.auth === false) {
      throw new Error(data.message || 'Sessao expirada. Faca login novamente.');
    }

    if (data.status !== 'ok' || !Array.isArray(data.registro)) {
      throw new Error('Resposta invalida do servidor backend.');
    }

    var livro = data.registro[0];

    if (!livro) {
      throw new Error('Livro nao encontrado.');
    }

    document.getElementById('livroid').value = livro.livroid;
    document.getElementById('nomelivro').value = livro.nomelivro ?? '';
    document.getElementById('autor').value = livro.autor ?? '';
    document.getElementById('genero').value = livro.genero ?? '';
    document.getElementById('valor').value = livro.valor ?? '';
    document.getElementById('status').value = String(livro.status === true);
    document.getElementById('deleted').value = String(livro.deleted === true);
    return true;
  } catch (error) {
    alert(error.message || 'Erro ao carregar livro.');
    return false;
  }
}

//-- UPDATE
async function vwUpdateLivro() {
  var form = document.getElementById('frmLivros');
  var btnAtualizar = document.getElementById('btnAtualizarLivro');

  if (btnAtualizar.disabled || !form.reportValidity()) {
    return;
  }

  try {
    var livroId = document.getElementById('livroid').value;
    var servidorTrabalho = form.dataset.servidorTrabalho;

    if (!livroId || !/^\d+$/.test(livroId) || Number(livroId) <= 0) {
      throw new Error('ID do livro invalido.');
    }

    if (!servidorTrabalho) {
      throw new Error('Endereco do servidor backend nao configurado.');
    }

    btnAtualizar.disabled = true;

    var response = await fetch(servidorTrabalho + '/updateLivro/' + encodeURIComponent(livroId), {
      method: 'PUT',
      headers: montarHeadersAutenticacao({
        'content-type': 'application/json'
      }),
      body: JSON.stringify(montarLivroDoFormulario())
    });

    if (!response.ok) {
      throw new Error('Nao foi possivel atualizar o livro.');
    }

    var data = await response.json();

    if (data.auth === false) {
      throw new Error(data.message || 'Sessao expirada. Faca login novamente.');
    }

    if (data.status !== 'ok') {
      throw new Error(data.status || 'Nao foi possivel atualizar o livro.');
    }

    if (data.linhasAfetadas !== 1) {
      throw new Error('Nenhum livro foi atualizado.');
    }

    window.location.href = '/livro';
  } catch (error) {
    alert(error.message || 'Erro ao atualizar livro.');
  } finally {
    btnAtualizar.disabled = false;
  }
}

//-- DELETE (logico no backend: marca deleted = true)
async function vwDeleteLivro() {
  var form = document.getElementById('frmLivros');
  var btnRemover = document.getElementById('btnRemoverLivro');

  if (btnRemover.disabled) {
    return;
  }

  if (!window.confirm('Confirma a remocao deste livro?')) {
    return;
  }

  try {
    var livroId = document.getElementById('livroid').value;
    var servidorTrabalho = form.dataset.servidorTrabalho;

    if (!livroId || !/^\d+$/.test(livroId) || Number(livroId) <= 0) {
      throw new Error('ID do livro invalido.');
    }

    if (!servidorTrabalho) {
      throw new Error('Endereco do servidor backend nao configurado.');
    }

    btnRemover.disabled = true;

    var response = await fetch(servidorTrabalho + '/deleteLivro/' + encodeURIComponent(livroId), {
      method: 'DELETE',
      headers: montarHeadersAutenticacao()
    });

    if (!response.ok) {
      throw new Error('Nao foi possivel remover o livro.');
    }

    var data = await response.json();

    if (data.auth === false) {
      throw new Error(data.message || 'Sessao expirada. Faca login novamente.');
    }

    if (data.status !== 'ok') {
      throw new Error(data.status || 'Nao foi possivel remover o livro.');
    }

    if (data.linhasAfetadas !== 1) {
      throw new Error('Nenhum livro foi removido.');
    }

    window.location.href = '/livro';
  } catch (error) {
    alert(error.message || 'Erro ao remover livro.');
  } finally {
    btnRemover.disabled = false;
  }
}

function montarLivroDoFormulario() {
  return {
    nomeLivro: document.getElementById('nomelivro').value,
    autor: document.getElementById('autor').value,
    genero: document.getElementById('genero').value,
    valor: Number(document.getElementById('valor').value),
    status: document.getElementById('status').value === 'true',
    deleted: document.getElementById('deleted').value === 'true'
  };
}
