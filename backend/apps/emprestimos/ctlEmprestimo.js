const mdlEmprestimos= require("../model/mdlEmprestimo");

const GetAllEmprestimo = (req, res) =>
    (async () => {
        let registro = await mdlEmprestimos.GetAllEmprestimos();
        
        for (let i = 0; i < registro.length; i++){
            const row = registro[i];
            
            if (row.data_emprestimo) {
                row.data_emprestimo = row.data_emprestimo.toISOString().split('T')[0];
            }
            
            if (row.data_devolucao) {
                row.data_devolucao = row.data_devolucao.toISOString().split('T')[0];
            }
        }
        
        res.json({ status: "ok", "registro": registro });
    })();

const GetEmprestimoByID= (req, res) =>
    (async () => {
        const emprestimoID = parseInt(req.params.emprestimoid);
        let registro = await mdlEmprestimos.GetEmprestimoByID(emprestimoID);
        res.json({ status:"ok", "registro":registro });
    })();

const InsertEmprestimo= (request,res) =>
    (async ()=>{
        const emprestimoREG = request.body;
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
        let{ msg,linhasAfetadas} = await mdlEmprestimos.DeleteEmprestimo(emprestimoID);
        res.json({ "status":msg, "linhasAfetadas":linhasAfetadas });
    })();

    const GetLivroForEmprestimo= (req,res) =>
        (async ()=>{
            let registro=await mdlEmprestimos.GetLivroForEmprestimo();
            res.json({ status:"ok", "registro":registro });
        })();
        
module.exports ={
    GetAllEmprestimo,
    GetEmprestimoByID,
    GetLivroForEmprestimo,
    InsertEmprestimo,
    UpdateEmprestimo,
    DeleteEmprestimo
};