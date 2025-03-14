import { pool } from '@/config/db';
import authMiddleware from '@/pages/api/authMiddleware';

export default async function handler(req, res) {
    await authMiddleware(req, res, async () => {

        if (req.user.rol_id !== 1) {
            return res.status(403).json({ error: 'Acceso denegado. Solo administradores pueden ver la auditoría.' });
        }

        if (req.method === 'GET') {
            try {
                const { page = 1, limit = 10 } =req.query;
                const offset = (parseInt(page) - 1) * parseInt(limit);

                const [totalRows] = await pool.query('SELECT COUNT(*) as total FROM actividad');
                const total = totalRows[0].total;

                const [totalrows] = await pool.query(`
                    SELECT a.*, u.nombre_usuario as usuario_nombre
                    FROM actividad a
                    LEFT JOIN usuarios u ON a.usuario_id = u.id
                    ORDER BY a.fecha DESC
                    LIMIT ? OFFSET ?
                `, [parseInt(limit), offset]);

                res.status(200).json({
                    data: totalrows,
                    pagination: {
                        total,
                        page: parseInt(page),
                        limit: parseInt(limit),
                        totalPages: Math.ceil(total / limit)
                    }
                });

                let query = `
                    SELECT a.*, u.nombre_usuario as usuario_nombre 
                    FROM actividad a 
                    LEFT JOIN usuarios u ON a.usuario_id = u.id
                `;

                let params = [];

                query += ' ORDER BY a.fecha DESC';

                const [rows] = await pool.query(query, params);
                res.status(200).json(rows);
                
        } catch (error) {
            console.error('Error al obtener auditoría:', error);
            res.status(500).json({ error: 'Error al obtener auditoría' });
        }
    } else {
        res.status(405).json({ error: 'Método no permitido' });
    }
    });
}
