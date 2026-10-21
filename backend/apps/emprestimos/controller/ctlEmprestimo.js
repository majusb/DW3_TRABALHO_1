const mdlEmprestimos= require("../model/mdlEmprestimo");

const GetAllEmprestimo = (req, res) =>
    (async () => {
        //Pula a execução até o model retornar todos os registros do banco de dados
        let registro = await mdlEmprestimos.GetAllEmprestimo();
        
        // Loop para percorrer cada item da lista de empréstimos retornada
        for (let i = 0; i < registro.length; i++){
            const row = registro[i];
            
            // Se existir uma data de empréstimo, formata o padrão para mostrar apenas a data (YYYY-MM-DD), removendo a hora
            if (row.data_emprestimo) {
                row.data_emprestimo = row.data_emprestimo.toISOString().split('T')[0];
            }
            
            // formata a data de devolução
            if (row.data_devolucao) {
                row.data_devolucao = row.data_devolucao.toISOString().split('T')[0];
            }
        }
        // Retorna a resposta em formato JSON com o status "ok" e a lista de registros formatados
        res.json({ status: "ok", "registro": registro });
    })();

const GetEmprestimoByID= (req, res) =>
    (async () => {
        // pega o id e converte para inteiro
        const emprestimoID = parseInt(req.params.emprestimoid);
        //busca o registro no banco de dados usando o model
        let registro = await mdlEmprestimos.GetEmprestimoByID(emprestimoID);
        res.json({ status:"ok", "registro":registro });
    })();

const InsertEmprestimo= (request,res) =>
    (async ()=>{
        // pega o registro do corpo da requisição
        const emprestimoREG = request.body;
        // Envia os dados para o model inserir no banco e aguarda a resposta
        let { msg,linhasAfetadas}= await mdlEmprestimos.InsertEmprestimo(emprestimoREG);
        res.json({ "status":msg, "linhasAfetadas":linhasAfetadas });
    })();


const UpdateEmprestimo= (request,res) =>
    (async ()=>{
        const emprestimoID = parseInt(request.params.emprestimoid);
        const emprestimoREG = request.body;
        let{ msg,linhasAfetadas} = await mdlEmprestimos.UpdateEmprestimo(emprestimoID,emprestimoREG);
        res.json({ "status":msg, "linhasAfetadas":linhasAfetadas });
    })();

const DeleteEmprestimo= (request,res) =>
    (async ()=>{
        const emprestimoID=parseInt(request.params.emprestimoid);
        // Chama a função DeleteEmprestimo do model para deletar o registro com o ID fornecido
        let{ msg,linhasAfetadas} = await mdlEmprestimos.DeleteEmprestimo(emprestimoID);
        res.json({ "status":msg, "linhasAfetadas":linhasAfetadas });
    })();

    const GetLivroForEmprestimo= (req,res) =>
        (async ()=>{
            // Chama a função GetLivroForEmprestimo do model para obter os livros disponíveis para empréstimo
            let registro=await mdlEmprestimos.GetLivroForEmprestimo();
            res.json({ status:"ok", "registro":registro });
        })();
        
// exports dos métodos do controller para serem utilizados nas rotas
module.exports ={
    GetAllEmprestimo,
    GetEmprestimoByID,
    GetLivroForEmprestimo,
    InsertEmprestimo,
    UpdateEmprestimo,
    DeleteEmprestimo
};