import { pool } from '../db.js'

// 1. LISTAR TODAS AS IMAGENS (GET)
export const getImages = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM images')
        res.status(200).json(rows)
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar imagens' })
    }
}

// 2. SALVAR NOVA IMAGEM (POST)
export const uploadImage = async (req, res) => {
    try {
        const { title, description } = req.body
        const url = req.file ? req.file.filename : null // Pega o nome do arquivo gerado pelo Multer


        if (!url) {
            return res.status(400).json({ error: 'Nenhuma imagem foi enviada' })
        }


        const [result] = await pool.query(
            'INSERT INTO images (title, description, url) VALUES (?, ?, ?)',
            [title, description, url]
        )


        res.status(201).json({ id: result.insertId, title, description, url })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Erro ao salvar imagem no banco' })
    }
}

// 3. ATUALIZAR IMAGEM (PUT)
export const updateImage = async (req, res) => {
    try {
        const { id } = req.params
        const { title, description } = req.body
        const url = req.file ? req.file.filename : null


        // Lógica simples: se enviou foto nova, atualiza a URL, senão mantém a antiga
        if (url) {
            await pool.query('UPDATE images SET title = ?, description = ?, url = ? WHERE id = ?', [title, description, url, id])
        } else {
            await pool.query('UPDATE images SET title = ?, description = ? WHERE id = ?', [title, description, id])
        }


        res.status(200).json({ message: 'Imagem atualizada com sucesso' })
    } catch (error) {
        res.status(500).json({ error: 'Erro ao atualizar imagem' })
    }
}

// 4. DELETAR IMAGEM (DELETE)
export const deleteImage = async (req, res) => {
    try {
        const { id } = req.params
        await pool.query('DELETE FROM images WHERE id = ?', [id])
        res.status(200).json({ message: 'Imagem deletada com sucesso' })
    } catch (error) {
        res.status(500).json({ error: 'Erro ao deletar imagem' })
    }
}
