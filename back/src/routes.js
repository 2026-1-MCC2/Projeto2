import { Router } from 'express';
import upload from './uploadConfig.js';

// Importando os controllers
import * as userCtrl from './controllers/useController.js';
import { login } from './controllers/authController.js';

const r = Router();

// --- ROTA DE LOGIN ---
r.post('/login', login);

// --- ROTAS DE USUÁRIOS ---
// Verifique se os nomes das funções (getUsers, createUser, etc) 
// estão iguais dentro do seu useController.js
r.get('/users', userCtrl.getUsers);
r.post('/users', upload.single('image'), userCtrl.createUser);
r.delete('/users/:id', userCtrl.deleteUser);

// Se você tiver a função getUserById, a linha é esta:
// r.get('/users/:id', userCtrl.getUserById);

export default r;