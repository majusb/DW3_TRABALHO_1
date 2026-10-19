var express=require('express');
var router=express.Router();

router.get('/', function(req,res) {
    res.render('emprestimo/vwLstEmprestimo', {
        title: 'Empréstimos',
        showNavbar: true,
        activeMenu: 'emprestimos',
        servidorDw3: process.env.SERVIDOR_DW3// Usado para configurar a url do backend.
    });
});

router.get('/form',function(req,res) {
    res.render('emprestimo/vwFormEmprestimo',{
        title: 'Formulario de empréstimos',
        showNavbar: true,
        activeMenu: 'emprestimos',
        servidorDw3: process.env.SERVIDOR_DW3
    });
});

module.exports =router;