    //-- routes/routes.js $`
    const express = require("express");
    const routerApp = express.Router();

    const appEmprestimos = require("../apps/emprestimos/ctlEmprestimo");

    routerApp.use((req, res, next) => {
    next();
    });

    routerApp.get("/", (req, res) => {
    res.send("Olá mundo!");
    });

    //@ Rotas de Livros
    

    //@ Rotas de Emprestimos
    routerApp.get("/getAllEmprestimos", appEmprestimos.GetAllEmprestimos);
    routerApp.get("/getEmprestimoByID/:emprestimoid", appLogin.AutenticaJWT,appEmprestimos.GetEmprestimoByID);
    routerApp.post("/insertEmprestimo", appLogin.AutenticaJWT,appEmprestimos.InsertEmprestimo);
    routerApp.put("/updateEmprestimo/:emprestimoid", appLogin.AutenticaJWT,appEmprestimos.UpdateEmprestimo);
    routerApp.delete("/deleteEmprestimo/:emprestimoid", appLogin.AutenticaJWT,appEmprestimos.DeleteEmprestimo);



    // Rota Login


    module.exports = routerApp;
