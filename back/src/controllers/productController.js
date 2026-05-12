import { pool } from '../db.js';
import fs from 'fs';

// 1. LISTAR PRODUTOS (Catálogo Público)
export async function listProducts(_, res) {
    try {
        // Mudança: Listamos da tabela oficial 'products'. 
        // Ela não tem coluna 'status', então pegamos tudo que está nela (pois já foi aprovado)
        const [rows] = await pool.query("SELECT * FROM products");
        res.json(rows);
    } catch (err) {
        console.error("Erro ao listar produtos:", err);
        res.status(500).json({ error: 'Erro ao buscar produtos.' });
    }
}

// 2. CRIAR PRODUTO (Direto na tabela Oficial - Geralmente pelo Admin)
export async function createProduct(req, res) {
    const { name, description, price, category, stock, supplier_id } = req.body;
    const imgPath = req.file ? `/uploads/${req.file.filename}` : null;

    if (!name || !price || !supplier_id) {
        if (req.file) fs.unlink(req.file.path, () => {});
        return res.status(400).json({ error: 'Nome, preço e ID do fornecedor são obrigatórios.' });
    }

    try {
        // REMOVI a coluna 'status' aqui, porque na sua tabela 'products' ela não existe
        const [result] = await pool.query(
            'INSERT INTO products (name, description, price, category, stock, img, supplier_id) VALUES (?,?,?,?,?,?,?)',
            [name, description, price, category, stock || 0, imgPath, supplier_id]
        );
        res.status(201).json({ id: result.insertId, message: 'Produto adicionado com sucesso!' });
    } catch (err) {
        console.error("Erro ao criar produto oficial:", err.message);
        if (req.file) fs.unlink(req.file.path, () => {});
        res.status(500).json({ error: 'Erro ao cadastrar produto oficial.' });
    }
}

// 3. CRIAR PRODUTO PENDENTE (Tabela de SOLICITAÇÕES)
// Esta função agora salva na tabela correta: product_requests
export const createPendingProduct = async (req, res) => {
    try {
        const { nome, preco, descricao, categoria, estoque, supplier_id } = req.body;
        const imgPath = req.file ? `/uploads/${req.file.filename}` : null;

        if (!nome || !preco) {
            if (req.file) fs.unlink(req.file.path, () => {});
            return res.status(400).json({ error: "Nome e preço são obrigatórios." });
        }

        // AQUI ESTAVA O ERRO: Mudamos para 'product_requests' e incluímos o 'status'
        const sql = `
            INSERT INTO product_requests (name, price, description, category, stock, img, supplier_id, status) 
            VALUES (?, ?, ?, ?, ?, ?, ?, 'pendente')
        `;

        await pool.query(sql, [
            nome, 
            preco, 
            descricao, 
            categoria || 'Geral', 
            estoque || 0, 
            imgPath, 
            supplier_id || null
        ]);

        res.status(201).json({ message: "Solicitação de produto enviada com sucesso!" });

    } catch (error) {
        console.error("ERRO NO BACKEND:", error.message);
        if (req.file) fs.unlink(req.file.path, () => {});
        res.status(500).json({ error: "Falha ao enviar para product_requests: " + error.message });
    }
};