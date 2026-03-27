import { Router } from 'express'
import upload from './uploadConfig.js'
import { getImages, uploadImage, updateImage, deleteImage } from './controllers/imageController.js'

// Importando as funções do seu novo useController
import {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser
} from './controllers/useController.js'


const r = Router()

// --- ROTAS DE USUÁRIOS (ALIMCONNECT / MRTS NUTS) ---
r.get('/users', getUsers)
r.get('/users/:id', getUserById)
r.post('/users', createUser)
r.put('/users/:id', updateUser)
r.delete('/users/:id', deleteUser)

// --- ROTAS DE IMAGENS ---
r.get('/images', getImages)

// AQUI ESTAVA O ERRO: Mudei de 'UploadImage' para 'uploadImage' (com 'u' minúsculo)
r.post('/images', upload.single('image'), uploadImage)

r.put('/images/:id', upload.single('image'), updateImage)
r.delete('/images/:id', deleteImage)

export default r
