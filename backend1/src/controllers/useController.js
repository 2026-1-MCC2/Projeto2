import {pool} from '../db.js'
//Listar Todos
export async function getUsers(_, res){
    try{
        const [rows] = await pool.query(
            'SELECT id, name, email, created_at FROM users ORDER BY id DESC'
        )
        res.json(rows)
    } catch {
        res.status(500).json({error: 'Erro ao listar users'})
    }
}
//Criar Usuário
export async function createUser(req, res){
    const {name, email} = req.body
    if(!name || !email){
        return res.status(400).json({error: 'Nome e Email são obrigatórios'})
    }
    try{
        const [result] = await pool.query(
            'INSERT INTO users (name, email) VALUES (?,?)',
            [name, email]
        )
        res.status(201).json({id: result.insertId})
    } catch (err){
        if(err.code === 'ER_DUP_ENTRY'){
            return res.status(409).json({error: 'Email já cadastrado'})
        }
        res.status(500).json({error: 'Erro ao criar usuário'})
    }
}
//Buscar por ID
export async function getUserById(req, res){
    const {id} = req.params
    try{
        const [rows] = await pool.query(
            'SELECT id, name, email, created_at FROM users WHERE id= ?',
            [id]
        )
        if(rows.length === 0){
            return res.status(404).json({error: 'Usuário não encontrado'})
        }
        res.json(rows[0])
    } catch {
        res.status(500).json({error: 'Erro ao Buscar Usuário'})
    }
}
//Rota do Tipo DELETE
//http://localhost:3000/api/users/:id
export async function deleteUser(req, res){
    const {id} = req.params
    try{
        const[result] = await pool.query(
            'DELETE FROM users WHERE id =?',
            [id]
        )
        if(result.affectedRows === 0){
            return res.status(404).json({error:'Usuário não encontrado!'})
        }
        res.json({message:'Usuário excluído com sucesso'})
    } catch {
        res.status(500).json({error:'Erro ao excluir usuário'})
    }
}
//Rota do Tipo PUT
//http://localhost:3000/api/users/:id
export async function updateUser(req, res){
    const {id} = req.params
    const {name, email} = req.body
    if(!name || !email){
        return res.status(400).json({error:'Nome e email são obrigatórios!'})
    }
    try{
        const[result] = await pool.query(
            'UPDATE users SET name =?, email=? WHERE id=?',
            [name, email, id]
        )
        if(result.affectedRows === 0){
            return res.status(404).json({error:'usuário não encontrado'})
        }
        const[rows] = await pool.query(
            'SELECT id, name, email, created_at FROM users WHERE id=?',
            [id]
        )
        res.json(rows[0])
    } catch(err){
        if(err.code === 'ER_DUP_ENTRY'){
            return res.status(409).json({error:'Email já cadastrado'})
        }
        res.status(500).json({error:'Erro ao atualizar Usuário'})
    }
}