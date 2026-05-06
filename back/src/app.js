import express from 'express'
import cors from 'cors'
import routes from './routes.js'
import path from 'path'

const app = express()

// 1. Configurações de leitura e segurança SEMPRE no topo!
app.use(cors()) // Permite que o Front-end acesse a API
app.use(express.json()) // Faz o Express entender dados em formato JSON

// 2. Rota de teste simples
app.get('/', (req, res) => {
    res.send('🚀 AlimConnect API está rodando')
})
  
// 3. Configura as rotas com prefixo /api (DEPOIS do express.json)
app.use('/api', routes)

// 4. Arquivos estáticos
app.use('/uploads', express.static(path.resolve('uploads')))

export default app