import { Router } from 'express'
import upload from './uploadConfig.js'
import {getImages, UploadImage, updateImage, deleteImage} from './controllers/imageController.js'
import {
    getUsers, getUserById,createUser,
    updateUser, deleteUser
} from './controllers/useController.js'

const r = Router()

r.get('/users', getUsers)
r.get('/users/:id', getUserById)
r.post('/users', createUser)
r.put('/users/:id', updateUser)
r.delete('/users/:id', deleteUser)

r.get('/images', getImages)
r.post('/images',upload.single('image'), UploadImage)
r.put('/image/:id', upload.single('image'), updateImage)
r.delete ('/image/:id'.deleteImage)
export default r