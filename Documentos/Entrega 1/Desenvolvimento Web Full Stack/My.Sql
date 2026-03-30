Esse é o primeiro código do Banco de Dados
--1 Prepara o Banco de Dados 
DROP DATABASE IF EXISTS alimconnect_db;
CREATE DATABASE alimconnect_db;
USE alimconnect_db;

CREATE TABLE users(
id INT AUTO_INCREMENT PRIMARY KEY,
name VARCHAR(255) NOT NULL,
email VARCHAR(255) NOT NULL UNIQUE,
role ENUM('comprador', 'fornecedor', 'admin') NOT NULL,
description TEXT,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE images (
id INT AUTO_INCREMENT PRIMARY KEY,
url VARCHAR (255) NOT NULL,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2 Mostra que as tabelas foram criadas  
SHOW TABLES;

-- 3 Mostra os dados que estão dentro da tabela 
-- O final da linha 
SELECT * FROM users;
