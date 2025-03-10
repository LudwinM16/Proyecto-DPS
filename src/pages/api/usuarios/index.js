import { pool } from '@/config/db';
import authMiddleware from '@/pages/api/authMiddleware';
import bcrypt from 'bcryptjs';
import { agregarUsuario } from '@/lib/usuarios';

export default async function handler(req, res) {
    await authMiddleware(req, res, async () => { // Proteger la ruta
        if (req.user.rol_id !== 1) {
            return res.status(403).json({ error: 'Acceso denegado. Solo administradores pueden gestionar usuarios.' });
        }

        if (req.method === 'GET') {
            try {
                const [rows] = await pool.query('SELECT id, nombre_usuario, rol_id FROM usuarios');
                return res.status(200).json(rows);
            } catch (error) {
                console.error('Error al obtener usuarios:', error);
                return res.status(500).json({ error: 'Error al obtener usuarios' });
            }
        }

        if (req.method === 'POST') {
            try {
                const { nombre_usuario, contrasena, rol_id } = req.body;

                if (!nombre_usuario || !contrasena) {
                    return res.status(400).json({ error: 'El nombre de usuario y la contraseña son obligatorios' });
                }

                // Encriptar la contraseña antes de guardar
                const salt = await bcrypt.genSalt(10);
                const hashContrasena = await bcrypt.hash(contrasena, salt);

                const [result] = await pool.query(
                    'INSERT INTO usuarios (nombre_usuario, contrasena, rol_id) VALUES (?, ?, ?)',
                    [nombre_usuario, hashContrasena, rol_id || 3]
                );

                return res.status(201).json({ id: result.insertId, nombre_usuario, rol_id: rol_id || 3 });
            } catch (error) {
                console.error('Error al crear usuario:', error);
                return res.status(500).json({ error: 'Error al crear usuario' });
            }
        }

        // Si no es GET ni POST, devolver error de método no permitido
        return res.status(405).json({ error: 'Método no permitido' });
    });
}
