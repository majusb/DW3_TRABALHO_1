    //-- routes/routes.js $`
    const express = require("express");
    const routerApp = express.Router();


const appLivros = require("../apps/livros/controller/ctlLivros");
const appEmprestimos = require("../apps/emprestimos/controller/ctlEmprestimo");
const appLogin = require("../apps/login/controller/ctlLogin"); // Ajuste o caminho se necessário

    routerApp.use((req, res, next) => {
    next();
    });

    routerApp.get("/", (req, res) => {
    res.send("Olá mundo!");
    });

    //@ Rotas de Livros
    //   appLogin.AutenticaJWT é um MIDDLEWARE: roda ANTES do controller e só deixa
    //   passar se o cabeçalho "Authorization: Bearer <token>" tiver um JWT válido.
    //   getAllLivros fica ABERTO (o front-end precisa da lista para montar o <select>
    //   de livro na tela de empréstimo), igual a apostila faz com getAllCursos.
    routerApp.get("/getAllLivros", appLivros.GetAllLivros);
    routerApp.get("/getLivroByID/:livroid", appLogin.AutenticaJWT, appLivros.GetLivroByID);
    routerApp.post("/insertLivro", appLogin.AutenticaJWT, appLivros.InsertLivro);
    routerApp.put("/updateLivro/:livroid", appLogin.AutenticaJWT, appLivros.UpdateLivro);
    routerApp.delete("/deleteLivro/:livroid", appLogin.AutenticaJWT, appLivros.DeleteLivro);

    //@ Rotas de Emprestimos
    routerApp.get("/getAllEmprestimo", appEmprestimos.GetAllEmprestimo);
    routerApp.get("/getLivroForEmprestimo", appLogin.AutenticaJWT, appEmprestimos.GetLivroForEmprestimo);
    routerApp.get("/getEmprestimoByID/:emprestimoid", appLogin.AutenticaJWT,appEmprestimos.GetEmprestimoByID);
    routerApp.post("/insertEmprestimo", appLogin.AutenticaJWT,appEmprestimos.InsertEmprestimo);
    routerApp.put("/updateEmprestimo/:emprestimoid", appLogin.AutenticaJWT,appEmprestimos.UpdateEmprestimo);
    routerApp.delete("/deleteEmprestimo/:emprestimoid", appLogin.AutenticaJWT,appEmprestimos.DeleteEmprestimo);



    // Rota Login
    routerApp.post("/Login", appLogin.Login);
    routerApp.post("/Logout", appLogin.Logout);


    module.exports = routerApp;
