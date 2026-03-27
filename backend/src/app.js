import express from 'express'
import cors from 'cors'
import path from 'path'
import routes from './routes.js'

const app = express()

// --- CONFIGURAÇÕES ---
app.use(cors())
app.use(express.json())

// --- ALTERAÇÃO AQUI ---
// Agora apontamos para 'src/uploads' para o navegador achar as fotos dos snacks
app.use('/uploads', express.static('src/uploads'))

// --- ROTAS ---
app.get('/health', (_, res) =>{
    res.json({
        ok: true,
        server: 'up',
        projeto: 'AlimConnect - MRTS Nuts'
    })
})

app.use('/api', routes)

export default app
