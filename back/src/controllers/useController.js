import { pool } from '../db.js';
import fs from 'fs';
import bcrypt from 'bcrypt';

export async function createUser(req, res) {
    const { name, email, senha, role, description } = req.body;
    const imgPath = req.file ? req.file.path : null;

    if (!name || !email || !senha || !role) {
        if (req.file) fs.unlink(req.file.path, () => {});
        return res.status(400).json({ error: 'Campos obrigatórios: name, email, senha e role.' });
    }

    try {
        // Criptografando a senha antes de salvar
        const salt = await bcrypt.genSalt(10);
        const senhaHash = await bcrypt.hash(senha, salt);

        const [result] = await pool.query(
            'INSERT INTO users (name, email, senha, role, description, img) VALUES (?,?,?,?,?,?)',
            [name, email, senhaHash, role, description || null, imgPath]
        );

        const firstName = name.split(' ')[0];
        let welcomeMsg = `Bem-vindo à AlimConnect, ${firstName}!`;
        if (role === 'comprador') welcomeMsg = `Olá ${firstName}! Pronto para comprar no AlimConnect?`;

        res.status(201).json({ id: result.insertId, message: welcomeMsg });
    } catch (err) {
        if (req.file) fs.unlink(req.file.path, () => {});
        if (err.code === 'ER_DUP_ENTRY') return res.status(409).json({ error: 'Email já cadastrado na AlimConnect.' });
        res.status(500).json({ error: 'Erro interno no servidor.' });
    }
}

export async function getUsers(_, res) {
    try {
        const [rows] = await pool.query('SELECT id, name, email, role, description, img FROM users');
        res.json(rows);
    } catch {
        res.status(500).json({ error: 'Erro ao listar AlimConnect.' });
    }
}

export async function deleteUser(req, res) {
    const { id } = req.params;
    try {
        const [rows] = await pool.query('SELECT img FROM users WHERE id = ?', [id]);
        if (rows.length > 0 && rows[0].img) fs.unlink(rows[0].img, () => {});
        await pool.query('DELETE FROM users WHERE id = ?', [id]);
        res.json({ message: 'Usuário removido da AlimConnect.' });
    } catch {
        res.status(500).json({ error: 'Erro ao deletar.' });
    }
}