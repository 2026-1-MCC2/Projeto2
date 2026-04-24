import {pool} from '../db.js'
import fs from 'fs'

//Criar Usuário
export async function createUser(req, res){
    const {name, email} = req.body
    if(!name || !email) {
        fs.unlink(req.file.path, ()=>{})
        return res.status(400).json({error: 'Nome e Email são obrigatórios'})
    }
    const imgPath = req.file ? req.file.path : null
    try{
        const [result] = await pool.query(
            'INSERT INTO users (name, email, img) VALUES (?,?,?)',
            [name, email, imgPath]
        )
        res.status(201).json({id: result.insertId, img: imgPath})
    } catch (err){
        if(req.file) fs.unlink(req.file.path, ()=>{})
        if(err.code === 'ER_DUP_ENTRY'){
            return res.status(409).json({error: 'Email já cadastrado'})
        }
        res.status(500).json({error: 'Erro ao criar usuário'})
    }
}
//Listar Todos
export async function getUsers(_, res){
    try{
        const [rows] = await pool.query(
            'SELECT id, name, email, img, created_at FROM users ORDER BY id DESC'
        )
        res.json(rows)
    } catch {
        res.status(500).json({error: 'Erro ao listar users'})
    }
}
//Buscar por ID
export async function getUserById(req, res){
    const {id} = req.params
    try{
        const [rows] = await pool.query(
            'SELECT id, name, email, img, created_at FROM users WHERE id= ?',
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
//Rota do Tipo PUT (Alterar)
export async function updateUser(req, res){
    const {id} = req.params
    const {name, email} = req.body
    if(!name || !email){
        return res.status(400).json({error:'Nome e email são obrigatórios!'})
    }
    try{
        const [rows] = await pool.query(
            'SELECT * FROM users WHERE id =?',
            [id]
        )
        if(rows.length === 0)
            return res.status(404).json({error:'usuário não encontrado'})
        const oldImg = rows[0].img
        const newImg = req.file ? req.file.path : oldImg
        const[result] = await pool.query(
            'UPDATE users SET name =?, email=?, img=? WHERE id=?',
            [name, email, newImg, id]
        )
        if(result.affectedRows === 0)
            return res.status(404).json({error:'usuário não encontrado'})
        if(req.file && oldImg)
            fs.unlink(oldImg, err =>{if(err) console.warn('Remover:', err)})
        const[updated] = await pool.query(
            'SELECT id, name, email, img, created_at FROM users WHERE id=?',
            [id]
        )
        res.json(updated[0])
    } catch(err){
        if(err.code === 'ER_DUP_ENTRY'){
            return res.status(409).json({error:'Email já cadastrado'})
        }
        res.status(500).json({error:'Erro ao atualizar Usuário'})
    }
}
//Rota do Tipo DELETE
export async function deleteUser(req, res){
    const {id} = req.params
    try{
        const [rows] = await pool.query('SELECT * FROM users WHERE id =?', [id])
        if(rows.length === 0)
            return res.status(404).json({error:'Usuário não encontrado!'})
        const imgPath = rows[0].img
        await pool.query(
            'DELETE FROM users WHERE id =?', [id]
        )
        if(imgPath)
            fs.unlink(imgPath, err =>{if (err) console.warn('Remover:', err)})
        res.json({message:'Usuário excluído com sucesso'})
    } catch {
        res.status(500).json({error:'Erro ao excluir usuário'})
    }
}