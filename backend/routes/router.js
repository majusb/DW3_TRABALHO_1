    //-- routes/routes.js $`
    const express = require("express");
    const routerApp = express.Router();

    //@ Importa os controllers de cada módulo (pasta apps/<modulo>/controller)
    const appLivros = require("../apps/livros/controller/ctlLivros");
    const appLogin = require("../apps/login/controller/ctlLogin");

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

    // Rota Login
    routerApp.post("/Login", appLogin.Login);
    routerApp.post("/Logout", appLogin.Logout);


    module.exports = routerApp;
