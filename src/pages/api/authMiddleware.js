import jwt from 'jsonwebtoken';
import { pool } from '@/config/db';

export default async function authMiddleware(req, res, next, rolesPermitidos = []) {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        

        if (!token) {
            return res.status(401).json({ error: 'Acceso no autorizado, token requerido' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const [rows] = await pool.query('SELECT id, nombre_usuario, rol_id FROM usuarios WHERE id = ?', [decoded.id]);

        if (rows.length === 0) {
            return res.status(401).json({ error: 'Usuario no encontrado' });
        }

        req.user = rows[0];
        

        // Validar si el rol del usuario está permitido
        if (rolesPermitidos.length > 0 && !rolesPermitidos.includes(req.user.rol_id)) {
            return res.status(403).json({ error: 'Acceso denegado, permisos insuficientes' });
        }
        return next();
        
    } catch (error) {
        console.error('Error en autenticación:', error);
        return res.status(401).json({ error: 'Token inválido o expirado' });
    }
}
