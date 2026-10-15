//-- arquivo: apps/login/model/mdlLogin.js
//-- O MODEL é a única camada que fala com o banco de dados.

const db = require("../../../database/databaseconfig");

//-- Busca o usuário e a senha (hash bcrypt) de quem está tentando logar.
//-- Retorna um ARRAY de linhas: [] se não achou, [{username, password}] se achou.
const GetCredencial = async (loginPar) => {
  return (
    await db.query(
      "select username, password " +
        "from usuarios where username = $1 and deleted = false",
      [loginPar]
    )
  ).rows;
};

module.exports = {
  GetCredencial,
};
