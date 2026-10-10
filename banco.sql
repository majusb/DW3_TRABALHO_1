CREATE TABLE livro(
	livroId NUMERIC(5,0),
	nomeLivro VARCHAR (150),
	autor VARCHAR(150),
	genero VARCHAR(150),
	status BOOLEAN,
	deleted boolean DEFAULT false
	CONSTRAINT livroId_pk PRIMARY KEY (livroId)
);

INSERT INTO livro (livroId, nomeLivro, autor, genero, status) VALUES
(1, 'O Senhor dos Anéis', 'J.R.R. Tolkien', 'Fantasia', true),
(2, '1984', 'George Orwell', 'Distopia', true),
(3, 'O Pequeno Príncipe', 'Antoine de Saint-Exupéry', 'Infantil', true),
(4, 'Dom Casmurro', 'Machado de Assis', 'Romance', true),
(5, 'A Revolução dos Bichos', 'George Orwell', 'Satira', true);

CREATE TABLE emprestimo(
	emprestimoId NUMERIC(5,0),
	nomePessoa VARCHAR(150),
	endereco VARCHAR(150),
	livroId NUMERIC(5,0),
	data_emprestimo DATE,
	data_devolucao DATE,
	deleted boolean DEFAULT false,
	CONSTRAINT emprestimoId_pk PRIMARY KEY (emprestimoId),
	CONSTRAINT livroId_fk FOREIGN KEY (livroId) REFERENCES livro
);

INSERT INTO emprestimo (emprestimoId, nomePessoa, endereco, livroId, data_emprestimo, data_devolucao) VALUES
(1, 'João Silva', 'Rua A, 123',(select livroId from livro where nomeLivro = 'O Senhor dos Anéis'), '2026-01-10', '2026-01-20'),
(2, 'Maria Oliveira', 'Rua B, 456', (select livroId from livro where nomeLivro = '1984'), '2026-02-15', '2026-02-25');


CREATE TABLE usuario(
	usuarioId NUMERIC(5,0),
	nomeUsuario VARCHAR(150),
	password text,
	deleted BOOLEAN DEFAULT false,
	CONSTRAINT usuarioId_pk PRIMARY KEY (usuarioId)
);

CREATE EXTENSION if NOT EXISTS pgcrypto;

insert into usuarios values
	(default, 'girl',crypt('girl',gen_salt('bf'))),
	(default, 'asd', crypt('asd',gen_salt('bf'))),

ON CONFLICTDONOTHING