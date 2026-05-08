import { verifyToken } from '../services/tokenService.js'

export async function verifyTokenMiddleware(req, res, next) {
    try {
        const authHeader = req.headers['authorization']
        const token = authHeader?.split(' ')[1]

        if (!token)
            return res.status(401).json({ error: 'Token não fornecido' })

        const decoded = await verifyToken(token)
        req.user = { id: decoded.id, jti: decoded.jti, role: decoded.role }
        next()

    } catch (err) {
        const status = err.message === 'Token denylisted' ? 401 : 403
        return res.status(status).json({ error: 'Token inválido ou expirado' })
    }
}

export function requireRole(...roles) {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ error: 'Acesso negado para este perfil.' })
        }
        next()
    }
}