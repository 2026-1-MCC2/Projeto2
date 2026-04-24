import { pool } from '../db.js';
import fs from 'fs';

export async function createProduct(req, res) {
    const { name, description, price, category, stock, supplier_id } = req.body;
    const imgPath = req.file ? req.file.path : null;

    if (!name || !price || !supplier_id) {
        if (req.file) fs.unlink(req.file.path, () => {});
        return res.status(400).json({ error: 'Nome, preço e ID do fornecedor são obrigatórios.' });
    }

    try {
        const [result] = await pool.query(
            'INSERT INTO products (name, description, price, category, stock, img, supplier_id) VALUES (?,?,?,?,?,?,?)',
            [name, description, price, category, stock || 0, imgPath, supplier_id]
        );
        res.status(201).json({ id: result.insertId, message: 'Produto adicionado ao cardápio AlimConnect!' });
    } catch (err) {
        if (req.file) fs.unlink(req.file.path, () => {});
        res.status(500).json({ error: 'Erro ao cadastrar produto.' });
    }
}

export async function listProducts(_, res) {
    try {
        const [rows] = await pool.query('SELECT * FROM products');
        res.json(rows);
    } catch {
        res.status(500).json({ error: 'Erro ao buscar produtos.' });
    }
}