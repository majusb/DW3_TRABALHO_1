const db = require("../../../database/databaseconfig");

const GetAllEmprestimo= async() => {
    return (
        await db.query(
        "SELECT *,(SELECT nomeLivro from LIVROS where livroId = emprestimos.livroId)" +
            "FROM emprestimos where deleted=false ORDER BY nomeLivro ASC"
        )
    ).rows;
};

const GetEmprestimoByID = async(emprestimoIDPar) => {
    return (
        await db.query(
            "SELECT *, (SELECT nomeLivro from LIVROS where livroId = emprestimos.livroId)" +
                "FROM emprestimos WHERE emprestimoId = $1 and deleted = false ORDER BY nomeLivro ASC",
            [emprestimoIDPar]
        )
    ).rows;
};

const InsertEmprestimo= async(emprestimoREGPar) => {
let linhasAfetadas;
let msg = "ok";
try{
    linhasAfetadas =(
        await db.query(
            "INSERT INTO emprestimos " + "values(default, $1, $2, $3, $4, $5, $6)",
            [
                emprestimoREGPar.nomePessoa,
                emprestimoREGPar.endereco,
                emprestimoREGPar.livroId,
                emprestimoREGPar.data_emprestimo,
                emprestimoREGPar.data_devolucao,
                emprestimoREGPar.deleted,
            ]
        )
    ).rowCount;
 }catch (error){
    msg = "[mdlEmprestimos|insertEmprestimos] "+ error.detail;
    linhasAfetadas = -1;
}
    return {msg, linhasAfetadas};
};

const UpdateEmprestimo = async(emprestimoIDPar, emprestimoREGPar) => {
    let linhasAfetadas;
    let msg="ok";
    try{
        linhasAfetadas = (
            await db.query(
                "UPDATE emprestimos SET " +
                    "nomePessoa = $2, " +
                    "endereco = $3, " +
                    "livroId = $4, " +
                    "data_emprestimo = $5, " +
                    "data_devolucao = $6, " +
                    "deleted = $7 " +
                    " WHERE emprestimoId = $1",
                [
                    emprestimoIDPar,
                    emprestimoREGPar.nomePessoa,
                    emprestimoREGPar.endereco,
                    emprestimoREGPar.livroId,
                    emprestimoREGPar.data_emprestimo,
                    emprestimoREGPar.data_devolucao,
                    emprestimoREGPar.deleted,
                ]
            )
        ).rowCount;
} catch(error){
    msg= "[mdlEmprestimos|updateEmprestimo] "+ error.detail;
    linhasAfetadas = -1;
}

    return {msg, linhasAfetadas};
};

const DeleteEmprestimo = async(emprestimoIDPar) => {
    let linhasAfetadas;
    let msg="ok";
    try{
        linhasAfetadas =(
        await db.query(
            "UPDATE emprestimos SET " + "deleted = true "+ "WHERE emprestimoId = $1",
            [emprestimoIDPar]
        )
    ).rowCount;
    }catch(error){
        msg= "[mdlEmprestimos|deleteEmprestimo] "+ error.detail;
        linhasAfetadas = -1;
    }

    return {msg, linhasAfetadas};
    };

    const GetLivroForEmprestimo= async() =>{
        return (await db.query("select livroId, nomeLivro from livros")).rows;
};

module.exports = {
    GetAllEmprestimo,
    GetEmprestimoByID,
    GetLivroForEmprestimo,
    InsertEmprestimo,
    UpdateEmprestimo,
    DeleteEmprestimo,
};