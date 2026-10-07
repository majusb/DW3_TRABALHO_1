CREATE TABLE livro(
	livroId NUMERIC(5,0),
	nomeLivro VARCHAR (150),
	autor VARCHAR(150),
	genero VARCHAR(150),
	status BOOLEAN,
	CONSTRAINT livroId_pk PRIMARY KEY (livroId)
);

CREATE TABLE emprestimo(
	emprestimoId NUMERIC(5,0),
	nomePessoa VARCHAR(150),
	endereco VARCHAR(150),
	livroId NUMERIC(5,0),
	data_emprestimo DATE,
	data_devolucao DATE,
	CONSTRAINT emprestimoId_pk PRIMARY KEY (emprestimoId),
	CONSTRAINT livroId_fk FOREIGN KEY (livroId) REFERENCES livro
);