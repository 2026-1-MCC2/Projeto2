import mysql from 'mysql2/promise';
import 'dotenv/config'; // Forma mais moderna e direta de carregar o .env

export const pool = mysql.createPool({
  // Usamos o operador || para garantir que, se o .env falhar, ele use os padrões do XAMPP
  host: process.env.MYSQL_HOST || 'localhost',
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || '', 
  database: process.env.MYSQL_DB || 'alimconnect_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Teste de conexão rápido para avisar no terminal se o banco cair
pool.getConnection()
    .then(conn => {
        console.log("✅ Banco de Dados conectado com sucesso!");
        conn.release();
    })
    .catch(err => {
        console.error("❌ Erro ao conectar no MySQL. Verifique se o XAMPP/Workbench está ligado.");
        console.error("Detalhe do erro:", err.message);
    });