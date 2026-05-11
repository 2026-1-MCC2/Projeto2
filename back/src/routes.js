import { Router } from 'express';
import upload from './uploadConfig.js';

// Importando os controllers
import * as userCtrl from './controllers/userController.js'; 
import { login, logout, resetPassword } from './controllers/authController.js';
import * as productCtrl from './controllers/productController.js';

// Importando os middlewares
import { verifyTokenMiddleware, requireRole } from './middlewares/authMiddleware.js';

const r = Router();

// --- AUTENTICAÇÃO ---
r.post('/login', login); 
r.post('/logout', verifyTokenMiddleware, logout); 
r.post('/auth/reset-password', resetPassword);  

// --- USUÁRIOS ---
r.post('/users', upload.single('image'), userCtrl.createUser); 
r.get('/users/me', verifyTokenMiddleware, userCtrl.getMyProfile);
r.get('/users', verifyTokenMiddleware, requireRole('administrador'), userCtrl.getUsers); 
r.delete('/users/:id', verifyTokenMiddleware, userCtrl.deleteUser);

// --- PRODUTOS ---
r.get('/products', productCtrl.listProducts); 

// Criar produto oficial (Só admin ou fornecedor logado)
r.post('/products', 
    verifyTokenMiddleware, 
    requireRole('administrador', 'fornecedor'), 
    upload.single('image'), 
    productCtrl.createProduct
);

// --- NOVO: PRODUTOS PENDENTES (Gerenciar Catálogo) ---
// Note que usamos 'imagem' (com M no final) para bater com o seu HTML
r.post('/produtos/pendentes', 
    upload.single('imagem'), 
    productCtrl.createPendingProduct
);

export default r;