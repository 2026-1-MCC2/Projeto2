import { pool } from '../db.js';
import bcrypt from 'bcrypt';
import { generateToken } from '../services/tokenService.js';

// --- LOGIN ---
export async function login(req, res) {
    const { email, senha } = req.body;

    if (!email || !senha) {
        return res.status(400).json({ error: 'E-mail e senha são obrigatórios.' });
    }

    try {
        const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);

        if (rows.length === 0) {
            return res.status(401).json({ error: 'E-mail ou senha incorretos.' });
        }

        const user = rows[0];
        const senhaValida = await bcrypt.compare(senha, user.senha);

        if (!senhaValida) {
            return res.status(401).json({ error: 'E-mail ou senha incorretos.' });
        }

        // O service retorna { token, jti }, pegamos apenas o token para o front
        const tokenData = generateToken({ 
            id: user.id, 
            role: user.role, 
            email: user.email 
        });

        res.json({
            message: `Bem-vindo de volta, ${user.name.split(' ')[0]}!`,
            token: tokenData.token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao processar o login.' });
    }
}

// --- LOGOUT ---
export async function logout(req, res) {
    try {
        res.json({ message: 'Logout realizado com sucesso!' });
    } catch (err) {
        res.status(500).json({ error: 'Erro ao realizar logout.' });
    }
}

// --- RESET PASSWORD ---
export async function resetPassword(req, res) {
    const { email, novaSenha } = req.body;

    if (!email || !novaSenha) {
        return res.status(400).json({ error: 'E-mail e nova senha são obrigatórios.' });
    }

    try {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(novaSenha, salt);

        const [result] = await pool.query('UPDATE users SET senha = ? WHERE email = ?', [hash, email]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Usuário não encontrado.' });
        }

        res.json({ message: 'Senha atualizada com sucesso!' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao resetar senha.' });
    }
}