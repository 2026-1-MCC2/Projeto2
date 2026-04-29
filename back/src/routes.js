
import { Router } from 'express';
import upload from './uploadConfig.js';

import * as userCtrl from './controllers/useController.js';
import { login } from './controllers/authController.js';
import * as productCtrl from './controllers/productController.js';

const r = Router();

// LOGIN
r.post('/login', login);

// USUÁRIOS
r.get('/users', userCtrl.getUsers);
r.post('/users', upload.single('image'), userCtrl.createUser);
r.delete('/users/:id', userCtrl.deleteUser);

// PRODUTOS
r.get('/products', productCtrl.listProducts);
r.post('/products', upload.single('image'), productCtrl.createProduct);

export default r;
