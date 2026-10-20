// Conteúdo do arquivo routes/rtLivro.js
var express = require('express');
var router = express.Router();

//-- /livro -> a tela da tabela
router.get('/', function(req, res) {
  res.render('livros/vwLstLivros', {
    title: 'Livros',
    showNavbar: true,
    activeMenu: 'livros',
    servidorTrabalho: process.env.SERVIDOR_DW3 // É necessário, pois o front em html não tem acesso ao .env
  });
});

//-- /livro/form -> a tela de cadastro
router.get('/form', function(req, res) {
  res.render('livros/vwFormLivros', {
    title: 'Formulario de livros',
    showNavbar: true,
    activeMenu: 'livros',
    servidorTrabalho: process.env.SERVIDOR_DW3
  });
});

module.exports = router;
