import{Router} from 'express'
import {pool} from './db.js'
const r = Router()  
//Rota de teste de conexão com a base de dados
// rota do tipo get: http://localhost:3000/api/db/health
r.get('/db/health', async(__dirname, res)=>{
    try{
      const[rows]= await pool.query('SELECT 1 AS db_ok')
      res.json ({ok: true, db: rows[0].db_ok})
  }catch{
    res.status(500).json({ok: false, db: 'down'})
  }
})

export default r