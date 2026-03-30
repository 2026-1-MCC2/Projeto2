import 'dotenv/config'
import mysql from 'mysql2/promise'

// Configuração do Pool de conexões
export const pool = mysql.createPool({
  host: process.env.MYSQL_HOST || 'localhost',
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || '', 
  database: 'alimconnect_db', // Nome exato que criamos no SQL acima
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Teste rápido de conexão ao iniciar o servidor
try {
    await pool.getConnection();
    console.log("✅ Conectado ao banco alimconnect_db com sucesso!");
} catch (error) {
    console.error("❌ Erro ao conectar no MySQL:", error.message);
}