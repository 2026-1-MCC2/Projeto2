import { pool } from '../db.js';
import fs from 'fs';
import bcrypt from 'bcrypt';



export async function createUser(req, res) {
    console.log('--- CREATE USER REAL ---');
    console.log('BODY:', req.body);

    const { name, email, senha, role, description } = req.body;

    console.log('name =', name);
    console.log('email =', email);
    console.log('senha =', senha);
    console.log('role =', role);
    console.log('description =', description);

    const imgPath = req.file ? req.file.path : null;

    if (!name || !email || !senha || !role) {
        if (req.file) fs.unlink(req.file.path, () => {});
        return res.status(400).json({
            error: 'Campos obrigatórios: name, email, senha e role.',
            debug: { name, email, senha, role, description }
        });
    }

    try {
        const salt = await bcrypt.genSalt(10);
        const senhaHash = await bcrypt.hash(senha, salt);

        const [result] = await pool.query(
            'INSERT INTO users (name, email, senha, role, description, img) VALUES (?,?,?,?,?,?)',
            [name, email, senhaHash, role, description || null, imgPath]
        );

        const firstName = name.split(' ')[0];
        let welcomeMsg = `Bem-vindo à AlimConnect, ${firstName}!`;

        if (role === 'comprador') {
            welcomeMsg = `Olá ${firstName}! Pronto para comprar no AlimConnect?`;
        }

        res.status(201).json({
            id: result.insertId,
            message: welcomeMsg
        });

    } catch (err) {
        if (req.file) fs.unlink(req.file.path, () => {});

        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({
                error: 'Email já cadastrado na AlimConnect.'
            });
        }

        console.error('Erro no createUser:', err);
        res.status(500).json({ error: 'Erro interno no servidor.' });
    }
}




export async function getUsers(_, res) {
    try {
        const [rows] = await pool.query(
            'SELECT id, name, email, role, description, img, created_at FROM users'
        );
        res.json(rows);
    } catch (err) {
        console.error('Erro em getUsers:', err);
        res.status(500).json({
            error: 'Erro ao listar usuários.',
            details: err.message,
            code: err.code
        });
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