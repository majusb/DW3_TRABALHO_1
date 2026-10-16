//Conteœdodoarquivo routes/rtLogin.js
var express = require('express');
var router = express.Router();

router.get('/', function(req,res){
    res.render('login',{
        title: 'Login',
        showNavbar: false,
        servidorTrabalho: process.env.SERVIDOR_TRABALHO
    });
});

router.post('/',function(req,res) {
    res.redirect('/home');
});

module.exports = router;