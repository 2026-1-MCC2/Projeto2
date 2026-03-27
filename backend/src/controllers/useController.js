import { pool } from '../db.js'
// --- LISTAR TODOS ---
// GET http://localhost:3000/api/users
export async function getUsers(_, res) {
    try {
        const [rows] = await pool.query(
            'SELECT id, name, email, role, description, created_at FROM users ORDER BY id DESC'
        )
        res.json(rows)
    } catch {
        res.status(500).json({ error: 'Erro ao listar usuários da AlimConnect' })
    }
}

// --- BUSCAR POR ID ---
// GET http://localhost:3000/api/users/:id
export async function getUserById(req, res) {
    const { id } = req.params
    try {
        const [rows] = await pool.query(
            'SELECT id, name, email, role, description, created_at FROM users WHERE id = ?',
            [id]
        )
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Usuário não encontrado' })
        }
        res.json(rows[0])
    } catch {
        res.status(500).json({ error: 'Erro ao buscar usuário' })
    }
}

// --- CRIAR USUÁRIO (COM AS MENSAGENS DOS SNACKS) ---
// POST http://localhost:3000/api/users
export async function createUser(req, res) {
    const { name, email, role, description } = req.body


    if (!name || !email || !role) {
        return res.status(400).json({ error: 'Nome, E-mail e Tipo de Conta (role) são obrigatórios' })
    }

    try {
        const [result] = await pool.query(
            'INSERT INTO users (name, email, role, description) VALUES (?,?,?,?)',
            [name, email, role, description]
        )

        let siteMessage = ''
        const firstName = name.split(' ')[0]

        if (role === 'comprador') {
            siteMessage = `Olá ${firstName}! Complete seu cadastro para comprar sua Batata Chips Artesanal (R$ 12,00).`
        } else if (role === 'fornecedor') {
            siteMessage = `${firstName}, você tem um novo pedido de 50 unidades de Amendoim Pimenta e Limão.`
        } else if (role === 'admin') {
            siteMessage = `Alerta: Novo usuário (${name}) cadastrado na plataforma AlimConnect.`
        }

        res.status(201).json({ id: result.insertId, message: siteMessage })
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ error: 'Este e-mail já está em uso no sistema da MRTS Nuts / AlimConnect.' })
        }
        res.status(500).json({ error: 'Erro ao criar usuário.' })
    }
}

// --- ATUALIZAR USUÁRIO (PUT) ---
// PUT http://localhost:3000/api/users/:id
export async function updateUser(req, res) {
    const { id } = req.params
    const { name, email, role, description } = req.body

    if (!name || !email || !role) {
        return res.status(400).json({ error: 'Nome, email e role são obrigatórios!' })
    }

    try {
        const [result] = await pool.query(
            'UPDATE users SET name = ?, email = ?, role = ?, description = ? WHERE id = ?',
            [name, email, role, description, id]
        )

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Usuário não encontrado' })
        }

        const [rows] = await pool.query(
            'SELECT id, name, email, role, description FROM users WHERE id = ?',
            [id]
        )
        res.json({ message: 'Dados atualizados com sucesso!', user: rows[0] })
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ error: 'Email já cadastrado em outra conta' })
        }
        res.status(500).json({ error: 'Erro ao atualizar usuário' })
    }
}

// --- EXCLUIR USUÁRIO (DELETE) ---
// DELETE http://localhost:3000/api/users/:id
export async function deleteUser(req, res) {
    const { id } = req.params
    try {
        const [result] = await pool.query(
            'DELETE FROM users WHERE id = ?',
            [id]
        )
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Usuário não encontrado!' })
        }
        res.json({ message: 'Usuário excluído com sucesso da AlimConnect' })
    } catch {
        res.status(500).json({ error: 'Erro ao excluir usuário' })
    }
}
