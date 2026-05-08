import { pool } from '../db.js';
import fs from 'fs';
import bcrypt from 'bcrypt';

// --- CRIAR USUÁRIO ---
export async function createUser(req, res) {
    const { name, email, senha, role, description } = req.body;
    const imgPath = req.file ? req.file.path : null;

    if (!name || !email || !senha || !role) {
        if (req.file) fs.unlink(req.file.path, () => {});
        return res.status(400).json({ error: 'Campos obrigatórios faltando.' });
    }

    try {
        const salt = await bcrypt.genSalt(10);
        const senhaHash = await bcrypt.hash(senha, salt);

        const [result] = await pool.query(
            'INSERT INTO users (name, email, senha, role, description, img) VALUES (?,?,?,?,?,?)',
            [name, email, senhaHash, role, description || null, imgPath]
        );

        res.status(201).json({ id: result.insertId, message: 'Cadastrado com sucesso!' });
    } catch (err) {
        if (req.file) fs.unlink(req.file.path, () => {});
        if (err.code === 'ER_DUP_ENTRY') return res.status(409).json({ error: 'E-mail já existe.' });
        res.status(500).json({ error: 'Erro interno.' });
    }
}

// --- LISTAR USUÁRIOS (Geralmente para o Admin) ---
export async function getUsers(_, res) {
    try {
        const [rows] = await pool.query('SELECT id, name, email, role, description, img FROM users');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: 'Erro ao listar usuários.' });
    }
}

// --- BUSCAR MEUS DADOS (Resolve o erro do /users/me no front) ---
export async function getMyProfile(req, res) {
    try {
        const [rows] = await pool.query(
            'SELECT id, name, email, role, description, img FROM users WHERE id = ?', 
            [req.user.id] // req.user vem do verifyTokenMiddleware
        );
        if (rows.length === 0) return res.status(404).json({ error: 'Usuário não encontrado.' });
        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: 'Erro ao buscar perfil.' });
    }
}

// --- DELETAR USUÁRIO (Com trava de segurança) ---
export async function deleteUser(req, res) {
    const { id } = req.params;
    const userLogadoId = req.user.id;
    const userLogadoRole = req.user.role;

    // SEGURANÇA: Só deleta se for Admin OU se for o próprio dono da conta
    if (userLogadoRole !== 'administrador' && userLogadoId != id) {
        return res.status(403).json({ error: 'Você não tem permissão para deletar outro usuário.' });
    }

    try {
        const [rows] = await pool.query('SELECT img FROM users WHERE id = ?', [id]);
        
        // Apaga a foto da pasta uploads antes de deletar do banco
        if (rows.length > 0 && rows[0].img) {
            fs.unlink(rows[0].img, (err) => {
                if (err) console.log("Foto não encontrada para deletar, seguindo...");
            });
        }

        await pool.query('DELETE FROM users WHERE id = ?', [id]);
        res.json({ message: 'Usuário removido da AlimConnect.' });
    } catch (err) {
        res.status(500).json({ error: 'Erro ao deletar usuário.' });
    }
}