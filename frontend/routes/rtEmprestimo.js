var express=require('express'); // Importa o módulo Express para criar rotas e lidar com requisições HTTP
var router=express.Router(); // Cria um objeto Router do Express para definir rotas específicas para o módulo de empréstimos

// Rota para a página de listagem de empréstimos, renderizando a view 'vwLstEmprestimo' com informações como título, exibição da barra de navegação, menu ativo e URL do servidor backend
router.get('/', function(req,res) {
    res.render('emprestimo/vwLstEmprestimo', {
        title: 'Empréstimos',
        showNavbar: true,
        activeMenu: 'emprestimos',
        servidorDw3: process.env.SERVIDOR_DW3// Usado para configurar a url do backend.
    });
});

// Rota para a página de formulário de empréstimos, renderizando a view 'vwFormEmprestimo' com informações como título, exibição da barra de navegação, menu ativo e URL do servidor backend
router.get('/form',function(req,res) {
    res.render('emprestimo/vwFormEmprestimo',{
        title: 'Formulario de empréstimos',
        showNavbar: true,
        activeMenu: 'emprestimos',
        servidorDw3: process.env.SERVIDOR_DW3
    });
});

module.exports =router;