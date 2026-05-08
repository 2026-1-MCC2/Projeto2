import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import routes from './routes.js'
import path from 'path'

dotenv.config() // <-- adiciona isso antes de tudo

const app = express()

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
    res.send('🚀 AlimConnect API está rodando')
})

app.use('/api', routes)
app.use('/uploads', express.static(path.resolve('uploads')))

export default app