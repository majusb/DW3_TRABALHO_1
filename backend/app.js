//@ Importa bibliotecas
const express = require("express")
require("dotenv").config();

//@ Configurao servidor
const app=express();
const port=process.env.PORT;

//@ Cria uma rota endereço raiz.
app.get("/", (req,res) =>{
    res.send("Hello DW3!")
})

//@ Iniciaoservidor
app.listen(port, ()=> {
    console.log("Executando a aplicação:" ,process.env.APP_NAME);
    console.log("Example application listening on port:", port);
})