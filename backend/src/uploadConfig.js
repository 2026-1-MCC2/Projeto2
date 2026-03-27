import multer from 'multer'
import path from 'path'
// Configuração do armazenamento (Storage)
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // AJUSTE: Como a pasta está dentro da 'src', colocamos 'src/uploads/'
        cb(null, 'src/uploads/')
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname)
        const name = `${Date.now()}-${Math.floor(Math.random() * 1E9)}${ext}`
        cb(null, name)
    }
})
// Aqui criamos a instância do upload usando o storage acima
const upload = multer({ storage: storage })

export default upload
