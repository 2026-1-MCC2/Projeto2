import { Router } from 'express'
import upload from './uploadConfig.js'

import {
    getUsers, getUserById,createUser,updateUser, deleteUser
} from './controllers/useController.js'

const r = Router()

r.get('/users', getUsers)
r.get('/users/:id', getUserById)
r.post('/users', upload.single('image'), createUser)
r.put('/users/:id', upload.single('image'), updateUser)
r.delete('/users/:id', deleteUser)

export default r