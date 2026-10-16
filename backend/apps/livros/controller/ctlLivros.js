//-- arquivo apps/livros/controller/ctlLivros.js
//-- Padrão de cada função: (req, res) => (async () => { ... })();
//-- O controller NÃO conversa com o banco: ele só chama o model e monta a resposta JSON.

const mdlLivros = require("../model/mdlLivros");

//-- GET /getAllLivros
const GetAllLivros = (req, res) =>
  (async () => {
    let registro = await mdlLivros.GetAllLivros();
    //@ Livros não tem campo de data, então não precisa converter nada.
    res.json({ status: "ok", "registro": registro });
  })();

//-- GET /getLivroByID/:livroid   (o id vem na URL -> req.params)
const GetLivroByID = (req, res) =>
  (async () => {
    const livroID = parseInt(req.params.livroid);
    let registro = await mdlLivros.GetLivroByID(livroID);

    res.json({ status: "ok", "registro": registro });
  })();

//-- POST /insertLivro   (os dados vêm no corpo JSON -> request.body)
const InsertLivro = (request, res) =>
  (async () => {
    const livroREG = request.body;
    let { msg, linhasAfetadas } = await mdlLivros.InsertLivro(livroREG);
    res.json({ "status": msg, "linhasAfetadas": linhasAfetadas });
  })();

//-- PUT /updateLivro/:livroid   (id na URL + dados no corpo)
const UpdateLivro = (request, res) =>
  (async () => {
    const livroID = parseInt(request.params.livroid);
    const livroREG = request.body;
    let { msg, linhasAfetadas } = await mdlLivros.UpdateLivro(livroID, livroREG);
    res.json({ "status": msg, "linhasAfetadas": linhasAfetadas });
  })();

//-- DELETE /deleteLivro/:livroid
const DeleteLivro = (request, res) =>
  (async () => {
    const livroID = parseInt(request.params.livroid);
    let { msg, linhasAfetadas } = await mdlLivros.DeleteLivro(livroID);
    res.json({ "status": msg, "linhasAfetadas": linhasAfetadas });
  })();

module.exports = {
  GetAllLivros,
  GetLivroByID,
  InsertLivro,
  UpdateLivro,
  DeleteLivro,
};
