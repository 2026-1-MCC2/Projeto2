import express from 'express'
import routes from './routes.js'
import path from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const app = express()
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

app.use(express.json())
app.use('/api', routes)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')))

export default app