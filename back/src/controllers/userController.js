import { pool } from '../db.js';
import fs from 'fs';
import bcrypt from 'bcrypt';

// --- 1. CRIAR USUÁRIO (Com Debug Logs) ---
export async function createUser(req, res) {
    console.log("-----------------------------------------");
    console.log("🚀 NOVA REQUISIÇÃO DE CADASTRO RECEBIDA!");
    
    // Mostra o que chegou no corpo da mensagem
    console.log("Dados (body):", req.body);
    // Mostra se o Multer conseguiu pegar a imagem
    console.log("Arquivo (file):", req.file ? req.file.filename : "Nenhuma imagem enviada");

    const { name, email, senha, role, description } = req.body;
    const imgPath = req.file ? req.file.path : null;

    // Verificação rigorosa de campos
    if (!name || !email || !senha || !role) {
        console.log("❌ ERRO: Campos obrigatórios faltando no formulário.");
        if (req.file) fs.unlink(req.file.path, () => {});
        return res.status(400).json({ error: 'Preencha todos os campos obrigatórios.' });
    }

    try {
        console.log("🔐 Criptografando senha...");
        const salt = await bcrypt.genSalt(10);
        const senhaHash = await bcrypt.hash(senha, salt);

        console.log("💾 Gravando no MySQL...");
        const [result] = await pool.query(
            'INSERT INTO users (name, email, senha, role, description, img) VALUES (?,?,?,?,?,?)',
            [name, email, senhaHash, role, description || null, imgPath]
        );

        console.log("✅ USUÁRIO CRIADO! ID:", result.insertId);
        res.status(201).json({ id: result.insertId, message: 'Conta AlimConnect criada com sucesso!' });
        
    } catch (err) {
        console.log("🔴 ERRO NO BANCO DE DADOS:");
        console.error(err);

        // Se deu erro, apaga a foto que o Multer acabou de salvar para não entulhar o servidor
        if (req.file) fs.unlink(req.file.path, () => {});

        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ error: 'Este e-mail já está cadastrado.' });
        }
        
        res.status(500).json({ error: 'Erro interno ao processar seu cadastro.' });
    }
}

// --- 2. LISTAR USUÁRIOS ---
export async function getUsers(_, res) {
    try {
        const [rows] = await pool.query('SELECT id, name, email, role, description, img FROM users');
        res.json(rows);
    } catch (err) {
        console.error("Erro ao listar:", err);
        res.status(500).json({ error: 'Erro ao buscar lista de usuários.' });
    }
}

// --- 3. PERFIL DO USUÁRIO LOGADO ---
export async function getMyProfile(req, res) {
    try {
        // O id vem do token decodificado pelo middleware
        const [rows] = await pool.query(
            'SELECT id, name, email, role, description, img FROM users WHERE id = ?', 
            [req.user.id] 
        );
        
        if (rows.length === 0) return res.status(404).json({ error: 'Usuário não encontrado.' });
        res.json(rows[0]);
    } catch (err) {
        console.error("Erro ao carregar perfil:", err);
        res.status(500).json({ error: 'Erro ao carregar seus dados.' });
    }
}

// --- 4. DELETAR USUÁRIO ---
export async function deleteUser(req, res) {
    const { id } = req.params;
    const userLogadoId = req.user.id;
    const userLogadoRole = req.user.role;

    // Regra: Admin deleta qualquer um, usuário comum só deleta a si mesmo
    if (userLogadoRole !== 'admin' && userLogadoRole !== 'administrador' && userLogadoId != id) {
        return res.status(403).json({ error: 'Acesso negado.' });
    }

    try {
        const [rows] = await pool.query('SELECT img FROM users WHERE id = ?', [id]);
        
        if (rows.length > 0 && rows[0].img) {
            fs.unlink(rows[0].img, (err) => {
                if (err) console.log("Aviso: Arquivo de imagem não existia no disco.");
            });
        }

        await pool.query('DELETE FROM users WHERE id = ?', [id]);
        res.json({ message: 'Conta removida com sucesso.' });
    } catch (err) {
        console.error("Erro ao deletar:", err);
        res.status(500).json({ error: 'Erro ao excluir conta.' });
    }
}