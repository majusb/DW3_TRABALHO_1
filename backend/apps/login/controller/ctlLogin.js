//-- arquivo: apps/login/controller/ctlLogin.js
//-- O CONTROLLER recebe a requisição, chama o model e monta a resposta.

const jwt = require("jsonwebtoken");   // gera e verifica tokens JWT
const bCrypt = require("bcryptjs");    // compara a senha digitada com o hash salvo no banco
const mdlLogin = require("../model/mdlLogin");

//-- POST /Login  -> corpo: { "username": "girl", "password": "girl" }
const Login = async (req, res, next) => {
  // 1) procura o usuário no banco
  const credencial = await mdlLogin.GetCredencial(req.body.username);

  if (credencial.length == 0) {
    return res.status(403).json({ message: "Usuário não identificado!" });
  }

  // 2) compara a senha digitada com o hash bcrypt gravado pelo banco.sql
  //    (crypt('girl', gen_salt('bf')) no Postgres gera um hash compatível com bcryptjs)
  if (bCrypt.compareSync(req.body.password, credencial[0].password)) {
    //auth ok
    // 3) gera o token JWT: payload { username }, assinado com SECRET_API
    const username = credencial[0].username;
    const token = jwt.sign({ username }, process.env.SECRET_API, {
      expiresIn: 120 * 60, //@ Expira em 02 horas (a apostila usa 600 = 10 min)
    });
    return res.json({ auth: true, token: token });
  }

  res.status(403).json({ message: "Login inválido!" });
};

//-- MIDDLEWARE usado nas rotas protegidas: verifica o cabeçalho "Authorization: Bearer <token>"
function AutenticaJWT(req, res, next) {
  const tokenHeader = req.headers["authorization"];
  if (!tokenHeader)
    return res
      .status(200)
      .json({ auth: false, message: "Não foi informado o token JWT" });

  // "Bearer eyJhbGci..."  ->  split(" ")  ->  ["Bearer", "eyJhbGci..."]
  const bearer = tokenHeader.split(" ");
  const token = bearer[1];

  // verifica assinatura (SECRET_API) e validade (exp)
  jwt.verify(token, process.env.SECRET_API, function (err, decoded) {
    if (err)
      return res
        .status(200)
        .json({ auth: false, message: "JWT inválido ou expirado" });

    req.userId = decoded.id;
    next();   // token ok -> segue para o controller da rota
  });
}

//-- POST /Logout -> com JWT não há "sessão" no servidor; quem descarta o token é o cliente.
const Logout = (req, res, next) => {
  res.json({ auth: false, token: null });
};

module.exports = {
  Login,
  Logout,
  AutenticaJWT,
};
