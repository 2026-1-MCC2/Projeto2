import dotenv from 'dotenv'
import path from 'path'
import mysql from 'mysql2/promise'

// Garante que o Node vai achar o .env na raiz da pasta 'back'
dotenv.config({ path: path.resolve(process.cwd(), '.env') })

export const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DB,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
})