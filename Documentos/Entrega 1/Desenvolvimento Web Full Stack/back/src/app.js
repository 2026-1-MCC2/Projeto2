import express from 'express'
import cors from 'cors'
import routes from './routes.js'
import path from 'path'

const app = express()

app.use(cors()) // Permite que o Front-end acesse a API
app.use(express.json())

// Configura as rotas com prefixo /api
app.use('/api', routes)

// Faz com que as imagens em /uploads fiquem visíveis (ex: http://localhost:3000/uploads/foto.jpg)
app.use('/uploads', express.static(path.resolve('uploads')))

export default app