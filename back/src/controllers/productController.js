import { pool } from '../db.js';
import fs from 'fs';

// 1. LISTAR PRODUTOS
// Retorna apenas produtos aprovados para o catálogo público
export async function listProducts(_, res) {
    try {
        const [rows] = await pool.query("SELECT * FROM products WHERE status = 'aprovado'");
        res.json(rows);
    } catch (err) {
        console.error("Erro ao listar produtos:", err);
        res.status(500).json({ error: 'Erro ao buscar produtos.' });
    }
}

// 2. CRIAR PRODUTO (Oficial/Admin)
// Usado quando o administrador ou fornecedor logado cadastra diretamente
export async function createProduct(req, res) {
    const { name, description, price, category, stock, supplier_id } = req.body;
    const imgPath = req.file ? `/uploads/${req.file.filename}` : null;

    if (!name || !price || !supplier_id) {
        if (req.file) fs.unlink(req.file.path, () => {});
        return res.status(400).json({ error: 'Nome, preço e ID do fornecedor são obrigatórios.' });
    }

    try {
        const [result] = await pool.query(
            'INSERT INTO products (name, description, price, category, stock, img, supplier_id, status) VALUES (?,?,?,?,?,?,?,?)',
            [name, description, price, category, stock || 0, imgPath, supplier_id, 'aprovado']
        );
        res.status(201).json({ id: result.insertId, message: 'Produto adicionado com sucesso!' });
    } catch (err) {
        console.error("Erro ao criar produto oficial:", err);
        if (req.file) fs.unlink(req.file.path, () => {});
        res.status(500).json({ error: 'Erro ao cadastrar produto.' });
    }
}

// 3. CRIAR PRODUTO PENDENTE (Gerenciar Catálogo)
// Esta é a função que o seu formulário "gerenciar-catalogo.html" chama
export const createPendingProduct = async (req, res) => {
    try {
        const { nome, preco, descricao } = req.body;
        
        // O Multer coloca os dados do arquivo em req.file
        const imgPath = req.file ? `/uploads/${req.file.filename}` : null;

        // Validação simples
        if (!nome || !preco) {
            if (req.file) fs.unlink(req.file.path, () => {});
            return res.status(400).json({ error: "Nome e preço são obrigatórios." });
        }

        // Importante: Verifique se os nomes das colunas no seu banco são estes:
        // name, price, description, img, status
        const sql = `
            INSERT INTO products (name, price, description, img, status) 
            VALUES (?, ?, ?, ?, 'pendente')
        `;

        await pool.query(sql, [nome, preco, descricao, imgPath]);

        res.status(201).json({ message: "Produto enviado para análise com sucesso!" });

    } catch (error) {
        // Isso vai imprimir o erro real no seu terminal para você ver se falta alguma coluna no banco
        console.error("ERRO NO BACKEND:", error.message);
        
        // Se deu erro, tentamos apagar a foto que o multer acabou de salvar
        if (req.file) fs.unlink(req.file.path, () => {});
        
        res.status(500).json({ error: "Falha interna no servidor ao processar catálogo." });
    }
};