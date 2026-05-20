import { Router } from 'express';
import upload from './uploadConfig.js';

// Conecta com o pool do seu db.js e o chama de db aqui dentro
import { pool as db } from './db.js'; 

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

// --- PRODUTOS OFICIAIS ---
r.get('/products', productCtrl.listProducts); 

r.post('/products', 
    verifyTokenMiddleware, 
    requireRole('administrador', 'fornecedor'), 
    upload.single('image'), 
    productCtrl.createProduct
);

// Rota para buscar apenas um produto pelo ID (Usado para abrir a página produto.html)
r.get('/products/:id', async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM products WHERE id = ?", [req.params.id]);
        if (rows.length > 0) {
            res.json(rows[0]);
        } else {
            res.status(404).json({ error: "Produto não encontrado" });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// --- FLUXO DE PRODUTOS PENDENTES & ANÁLISE ---

// 1. Fornecedor envia a solicitação salvando como 'pendente'
r.post('/produtos/pendentes', upload.single('imagem'), async (req, res) => {
    try {
        const { nome, descricao, preco, categoria, estoque, supplier_id } = req.body;
        const img = req.file ? req.file.filename : 'placeholder.png';

        // Garante conversão limpa dos tipos de dados para evitar erros de sintaxe no MariaDB
        const precoNum = parseFloat(preco) || 0.00;
        const estoqueNum = parseInt(estoque) || 0;
        const categoriaTexto = categoria || 'Snacks';
        const descTexto = descricao || '';
        const supplierIdNum = supplier_id ? parseInt(supplier_id) : null;

        const [result] = await db.query(
            "INSERT INTO product_requests (name, description, price, category, stock, img, supplier_id, status) VALUES (?, ?, ?, ?, ?, ?, ?, 'pendente')",
            [nome, descTexto, precoNum, categoriaTexto, estoqueNum, img, supplierIdNum]
        );

        res.status(201).json({ message: "Solicitação enviada ao administrador!", id: result.insertId });
    } catch (err) {
        console.error("Erro no INSERT do MariaDB:", err.message);
        res.status(500).json({ error: err.message });
    }
});

// 2. Dashboard do Fornecedor: Lista os produtos dele (aprovados e pendentes)
r.get('/fornecedor/produtos/:supplier_id', async (req, res) => {
    const { supplier_id } = req.params;
    try {
        const [aprovados] = await db.query("SELECT *, 'aprovado' as status_atual FROM products WHERE supplier_id = ?", [supplier_id]);
        const [pendentes] = await db.query("SELECT *, 'pendente' as status_atual FROM product_requests WHERE supplier_id = ? AND status = 'pendente'", [supplier_id]);
        
        res.json([...pendentes, ...aprovados]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 3. Painel do ADM: Lista tudo o que está esperando aprovação
r.get('/produtos/analise/pendentes', async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM product_requests WHERE status = 'pendente'");
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 4. Painel do ADM: Aprova ou Rejeita a solicitação e move para produtos oficiais (CORRIGIDA)
r.put('/produtos/analise/:id', async (req, res) => {
    const { id } = req.params;
    const { status } = req.body; 

    try {
        await db.query("UPDATE product_requests SET status = ? WHERE id = ?", [status, id]);

        if (status === 'aprovado') {
            const [request] = await db.query("SELECT * FROM product_requests WHERE id = ?", [id]);
            
            if (request.length > 0) {
                const p = request[0];
                
                // Mapeamento correto e seguro das propriedades da tabela de solicitações
                const nomeProduto = p.name || p.nome;
                const descProduto = p.description || p.descricao;
                const precoProduto = p.price !== undefined ? p.price : p.preco;
                const estoqueProduto = p.stock !== undefined ? p.stock : p.estoque;
                const supplierIdUnificado = p.supplier_id || null;

                await db.query(
                    "INSERT INTO products (name, description, price, category, stock, img, supplier_id, request_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
                    [
                        nomeProduto, 
                        descProduto, 
                        precoProduto, 
                        p.category || 'Snacks', 
                        estoqueProduto || 0, 
                        p.img, 
                        supplierIdUnificado, 
                        p.id
                    ]
                );
            }
        }
        res.json({ message: `Decisão gravada: ${status}` });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// --- BOTÕES DE GERENCIAMENTO DIRECTO PELO SITE ---

// Fornecedor ou Admin exclui um produto individual direto pelo card do site
r.delete('/produtos/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await db.query("DELETE FROM products WHERE id = ?", [id]);
        await db.query("DELETE FROM product_requests WHERE id = ?", [id]);
        res.json({ message: "Produto excluído com sucesso!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Botão Geral no painel: Deleta absolutamente TODOS os testes de uma vez só
r.delete('/limpar-todos-testes', async (req, res) => {
    try {
        await db.query("DELETE FROM products");
        await db.query("DELETE FROM product_requests");
        res.json({ message: "Banco de dados limpo com sucesso!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default r;