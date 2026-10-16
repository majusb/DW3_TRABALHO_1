//-- arquivo apps/livros/model/mdlLivros.js
//-- 5 operações CRUD: GetAllLivros, GetLivroByID, InsertLivro, UpdateLivro, DeleteLivro
//-- Mesmo padrão do módulo de cursos da apostila: os MESMOS nomes são usados no controller.

const db = require("../../../database/databaseconfig");

//-- Tabela livros: livroid | nomelivro | autor | genero | valor | status | deleted

//-- READ (todos)
const GetAllLivros = async () => {
  return (
    await db.query(
      "SELECT * FROM livros where deleted = false ORDER BY nomeLivro ASC"
    )
  ).rows;
};

//-- READ (um): $1 recebe o livroid
const GetLivroByID = async (livroIDPar) => {
  return (
    await db.query(
      "SELECT * FROM livros WHERE livroId = $1 and deleted = false ORDER BY nomeLivro ASC",
      [livroIDPar]
    )
  ).rows;
};

//-- CREATE
const InsertLivro = async (livroREGPar) => {
  //@ A variável msg devolve ao controller o erro vindo do banco de dados.
  let linhasAfetadas;
  let msg = "ok";
  try {
    linhasAfetadas = (
      await db.query(
        // "default" deixa o bigserial gerar o livroid automaticamente
        "INSERT INTO livros " + "values(default, $1, $2, $3, $4, $5, $6)",
        [
          livroREGPar.nomeLivro,
          livroREGPar.autor,
          livroREGPar.genero,
          livroREGPar.valor,
          livroREGPar.status,
          livroREGPar.deleted,
        ]
      )
    ).rowCount;   // quantidade de linhas inseridas (1 se deu certo)
  } catch (error) {
    // ex.: valor fora do numeric(8,2) ou tipo incompatível
    msg = "[mdlLivros|InsertLivro] " + error.detail;
    linhasAfetadas = -1;
  }

  return { msg, linhasAfetadas };
};

//-- UPDATE: $1 é o livroid (WHERE), $2..$7 são os novos valores
const UpdateLivro = async (livroIDPar, livroREGPar) => {
  let linhasAfetadas;
  let msg = "ok";
  try {
    linhasAfetadas = (
      await db.query(
        "UPDATE livros SET " +
          "nomeLivro = $2, " +
          "autor = $3, " +
          "genero = $4, " +
          "valor = $5, " +
          "status = $6, " +
          "deleted = $7 " +
          "WHERE livroId = $1",
        [
          livroIDPar,
          livroREGPar.nomeLivro,
          livroREGPar.autor,
          livroREGPar.genero,
          livroREGPar.valor,
          livroREGPar.status,
          livroREGPar.deleted,
        ]
      )
    ).rowCount;
  } catch (error) {
    msg = "[mdlLivros|UpdateLivro] " + error.detail;
    linhasAfetadas = -1;
  }

  return { msg, linhasAfetadas };
};

//-- DELETE lógico: NÃO apaga a linha, apenas marca deleted = true.
//-- Importante aqui: os emprestimos têm uma chave estrangeira (fk_emprestimo_livro)
//-- apontando para livros. Um DELETE físico daria erro se houvesse empréstimo do livro.
const DeleteLivro = async (livroIDPar) => {
  let linhasAfetadas;
  let msg = "ok";

  try {
    linhasAfetadas = (
      await db.query(
        "UPDATE livros SET " + "deleted = true " + "WHERE livroId = $1",
        [livroIDPar]
      )
    ).rowCount;
  } catch (error) {
    msg = "[mdlLivros|DeleteLivro] " + error.detail;
    linhasAfetadas = -1;
  }

  return { msg, linhasAfetadas };
};

module.exports = {
  GetAllLivros,
  GetLivroByID,
  InsertLivro,
  UpdateLivro,
  DeleteLivro,
};
