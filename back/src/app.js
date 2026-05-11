import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import routes from './routes.js'
import path from 'path'
import { fileURLToPath } from 'url'

// Configurações de caminho para módulos ES
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
    res.send('🚀 AlimConnect API está rodando')
})

app.use('/api', routes)

// AJUSTE AQUI: Garante que ele ache a pasta uploads na raiz do projeto
// Se sua pasta 'src' está dentro da raiz, o '..' volta um nível para achar a 'uploads'
app.use('/uploads', express.static(path.join(__dirname, '../uploads')))

export default app