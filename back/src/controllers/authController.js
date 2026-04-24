import { pool } from '../db.js';
import bcrypt from 'bcrypt';

export async function login(req, res) {
    const { email, senha } = req.body;

    // 1. Validação básica
    if (!email || !senha) {
        return res.status(400).json({ error: 'E-mail e senha são obrigatórios.' });
    }

    try {
        // 2. Busca o usuário pelo e-mail
        const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
        
        if (rows.length === 0) {
            return res.status(401).json({ error: 'E-mail ou senha incorretos.' });
        }

        const user = rows[0];

        // 3. Compara a senha digitada com a senha criptografada do banco
        const senhaValida = await bcrypt.compare(senha, user.senha);

        if (!senhaValida) {
            return res.status(401).json({ error: 'E-mail ou senha incorretos.' });
        }

        // 4. Se deu tudo certo, retorna os dados do usuário (exceto a senha)
        // Aqui no futuro você pode gerar um Token JWT
        res.json({
            message: `Bem-vindo de volta, ${user.name.split(' ')[0]}!`,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (err) {
        res.status(500).json({ error: 'Erro ao processar o login.' });
    }
}