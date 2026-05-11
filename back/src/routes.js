import { Router } from 'express';
import upload from './uploadConfig.js';

// Importando os controllers
import * as userCtrl from './controllers/userController.js'; 
import { login, logout, resetPassword } from './controllers/authController.js';
import * as productCtrl from './controllers/productController.js';

// Importando os middlewares (Certifique-se de que o nome do arquivo está correto)
import { verifyTokenMiddleware, requireRole } from './middlewares/authMiddleware.js';

const r = Router();

// --- AUTENTICAÇÃO ---
r.post('/login', login); 
r.post('/logout', verifyTokenMiddleware, logout); 
r.post('/auth/reset-password', resetPassword);  

// --- USUÁRIOS ---
// Criar usuário (Cadastro) - Geralmente não precisa de token se for auto-cadastro
r.post('/users', upload.single('image'), userCtrl.createUser); 

// Ver perfil próprio (Adicionado conforme sua solicitação)
r.get('/users/me', verifyTokenMiddleware, userCtrl.getMyProfile);

// Listar todos (Só admin)
r.get('/users', verifyTokenMiddleware, requireRole('administrador'), userCtrl.getUsers); 

// Deletar usuário
r.delete('/users/:id', verifyTokenMiddleware, userCtrl.deleteUser);

// --- PRODUTOS ---
// Listagem é pública (para compradores verem)
r.get('/products', productCtrl.listProducts); 

// Criar produto (Só admin ou fornecedor)
r.post('/products', 
    verifyTokenMiddleware, 
    requireRole('administrador', 'fornecedor'), 
    upload.single('image'), 
    productCtrl.createProduct
);

export default r;