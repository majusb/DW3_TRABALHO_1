----- Cria um banco de dados
-- create database dw3_trabalho;

create table IF NOT EXISTS livros (
    livroId bigserial constraint pk_livros PRIMARY KEY,
    nomeLivro varchar(150),
    autor varchar(150),
    genero varchar(150),
    valor numeric(8,2),
    status boolean,
    deleted boolean DEFAULT false
);

insert into livros values
    (default, 'O Senhor dos Anéis', 'J.R.R. Tolkien', 'Fantasia', 89.90, true),
    (default, '1984', 'George Orwell', 'Distopia', 54.90, true),
    (default, 'O Pequeno Príncipe', 'Antoine de Saint-Exupéry', 'Infantil', 34.90, true),
    (default, 'Dom Casmurro', 'Machado de Assis', 'Romance', 42.50, true),
    (default, 'A Revolução dos Bichos', 'George Orwell', 'Satira', 39.90, true)
    ON CONFLICT DO NOTHING;

create table IF NOT EXISTS emprestimos (
    emprestimoId bigserial constraint pk_emprestimos PRIMARY KEY,
    nomePessoa varchar(150),
    endereco varchar(150),
    livroId bigint constraint fk_emprestimo_livro REFERENCES livros,
    data_emprestimo date,
    data_devolucao date,
    deleted boolean DEFAULT false
);

insert into emprestimos values
    (default, 'João Silva', 'Rua A, 123',
        (select livroId from LIVROS where nomeLivro = 'O Senhor dos Anéis'),
        '2026-01-10', '2026-01-20'),
    (default, 'Maria Oliveira', 'Rua B, 456',
        (select livroId from LIVROS where nomeLivro = '1984'),
        '2026-02-15', '2026-02-25')
    ON CONFLICT DO NOTHING;

create table IF NOT EXISTS usuarios (
    usuarioId bigserial constraint pk_usuarios PRIMARY KEY,
    username varchar(10) UNIQUE,
    password text,
    deleted boolean DEFAULT false
);

CREATE EXTENSION if NOT EXISTS pgcrypto;

insert into usuarios values
    (default, 'girl', crypt('girl', gen_salt('bf'))), -- senha criptografada com bcrypt
    (default, 'asd', crypt('asd', gen_salt('bf'))) -- senha criptografada com bcrypt
    ON CONFLICT DO NOTHING;
