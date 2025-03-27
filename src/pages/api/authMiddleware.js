import jwt from 'jsonwebtoken';
import { pool } from '@/config/db';

// JWT quemado si no está en el entorno
const JWT_SECRET = process.env.JWT_SECRET || 'bf3d388edbe744b81471aa01b877e52bd029cca005450e6dfb97856682ec5180';

export default async function authMiddleware(req, res, next, rolesPermitidos = []) {
    try {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json({ error: 'Acceso no autorizado, token requerido' });
        }

        // Verifica el token con el JWT fijo o de entorno
        const decoded = jwt.verify(token, JWT_SECRET);

        // Busca el usuario desde la BD por el ID decodificado
        const [rows] = await pool.query(
            'SELECT id, nombre_usuario, rol_id FROM usuarios WHERE id = ?',
            [decoded.id]
        );

        if (rows.length === 0) {
            return res.status(401).json({ error: 'Usuario no encontrado' });
        }

        req.user = rows[0];

        // Verifica si el rol está permitido, si se especificaron roles
        if (rolesPermitidos.length > 0 && !rolesPermitidos.includes(req.user.rol_id)) {
            return res.status(403).json({ error: 'Acceso denegado, permisos insuficientes' });
        }

        return next();

    } catch (error) {
        console.error('Error en autenticación:', error.message);
        return res.status(401).json({ error: 'Token inválido o expirado' });
    }
}
