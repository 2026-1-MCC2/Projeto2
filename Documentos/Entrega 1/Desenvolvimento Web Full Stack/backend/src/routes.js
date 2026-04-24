import { Router } from 'express';
import upload from './uploadConfig.js';
import { createUser, getUsers, deleteUser } from './controllers/useController.js';
import { createProduct, listProducts } from './controllers/productController.js';

const r = Router();

// Usuários
r.post('/users', upload.single('image'), createUser);
r.get('/users', getUsers);
r.delete('/users/:id', deleteUser);

// Produtos (Comidas)
r.post('/products', upload.single('image'), createProduct);
r.get('/products', listProducts);

export default r;