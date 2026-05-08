import { Router } from 'express';
import upload from './uploadConfig.js';

import * as userCtrl from './controllers/userController.js'; 
import { login, logout, resetPassword } from './controllers/authController.js';
import * as productCtrl from './controllers/productController.js';
import { verifyTokenMiddleware, requireRole } from './middlewares/authMiddleware.js';

const r = Router();

// --- AUTENTICAÇÃO ---
r.post('/login', login); 
r.post('/logout', verifyTokenMiddleware, logout); 
r.post('/auth/reset-password', resetPassword);  

// --- USUÁRIOS ---
r.post('/users', upload.single('image'), userCtrl.createUser); 

// >>> ADICIONE ESTA LINHA AQUI <<<
// Ela permite que o usuário logado veja seus próprios dados (nome, email, etc)
r.get('/users/me', verifyTokenMiddleware, userCtrl.getMyProfile);

r.get('/users', verifyTokenMiddleware, requireRole('administrador'), userCtrl.getUsers); 
r.delete('/users/:id', verifyTokenMiddleware, userCtrl.deleteUser);

// --- PRODUTOS ---
r.get('/products', productCtrl.listProducts); 

r.post('/products', 
    verifyTokenMiddleware, 
    requireRole('administrador', 'fornecedor'), 
    upload.single('image'), 
    productCtrl.createProduct
);

export default r;