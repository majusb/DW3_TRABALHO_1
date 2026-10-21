    var createError = require('http-errors'); // Importa o módulo http-errors para lidar com erros HTTP e criar respostas de erro personalizadas
    var express = require('express'); // Importa o módulo Express para criar o servidor web e lidar com requisições HTTP
    var path = require('path'); // Importa o módulo path para lidar com caminhos de arquivos e diretórios
    var nunjucks = require('nunjucks'); // Importa o módulo Nunjucks para renderizar templates HTML com dados dinâmicos

    // Importa os módulos de rotas para diferentes partes da aplicação
    var indexRouter = require('./routes/rtIndex');
    var loginRouter = require('./routes/rtLogin');
    var homeRouter = require('./routes/rtHome');
    var emprestimosRouter = require('./routes/rtEmprestimo');
    var livroRouter = require('./routes/rtLivro');

    // Configura o carregamento de variáveis de ambiente a partir do arquivo 'dw3frontend.env', permitindo que a aplicação acesse configurações sensíveis como URLs de servidores e credenciais
    require('dotenv').config({ path: path.join(__dirname, 'dw3frontend.env'), quiet: true });

    // Cria uma instância do aplicativo Express, define os caminhos para as views e apps, e configura o servidor para escutar em uma porta específica (definida na variável de ambiente PORT ou padrão 40100)
    var app = express();
    var viewsPath = path.join(__dirname, 'views');
    var appsPath = path.join(__dirname, 'apps');
    const port = process.env.PORT || 40100;

    // Configura o mecanismo de visualização do Express para usar Nunjucks, definindo os diretórios de views e apps, habilitando a auto-escapagem de HTML e desativando o cache em ambiente de desenvolvimento
    app.set('views', [viewsPath, appsPath]);
    app.set('view engine', 'njk');

    // Configura o Nunjucks para renderizar templates, permitindo que a aplicação use variáveis e lógica dentro dos arquivos de template
    nunjucks.configure([viewsPath, appsPath], {
    autoescape: true,
    express: app,
    noCache: app.get('env') === 'development'
    });

    // Configura o Express para usar middlewares que processam dados JSON e URL-encoded, além de servir arquivos estáticos a partir dos diretórios 'public' e 'apps'
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    app.use(express.static(path.join(__dirname, 'public')));
    app.use('/apps', express.static(path.join(__dirname, 'apps')));

    // Define as rotas da aplicação, associando cada rota a um módulo específico que lida com as requisições e respostas para aquela rota
    app.use('/', indexRouter);
    app.use('/login', loginRouter);
    app.use('/home', homeRouter);
    app.use('/livro', livroRouter);
    app.use('/emprestimo', emprestimosRouter);


// Configura o tratamento de erros, incluindo a captura de erros 404 (página não encontrada) e a renderização de uma página de erro personalizada com informações sobre o erro ocorrido
    app.use(function(req, res, next) {
        next(createError(404));
    });

    // Middleware de tratamento de erros, que captura erros ocorridos durante o processamento das requisições e renderiza uma página de erro com informações detalhadas sobre o erro, incluindo a mensagem e o status HTTP
    app.use(function(err, req, res, next) {
        res.locals.message = err.message;
        res.locals.error = req.app.get('env') === 'development' ? err : {};
        res.status(err.status || 500);
        res.render('error', { title: 'Erro' });
    });
    
// Middleware de tratamento de erros, que captura erros ocorridos durante o processamento das requisições e envia uma resposta JSON com a mensagem de erro e o status HTTP correspondente
app.use((err, req, res, next) => {
    res.status(err.status || 500).json({ 
        message: err.message 
    });
});
    
// Inicia o servidor Express, fazendo com que ele escute na porta definida e exibindo uma mensagem no console indicando que o servidor está ativo e pronto para receber requisições
    app.listen(port, () => {
    console.log(`App listening at port ${port}`)
    })