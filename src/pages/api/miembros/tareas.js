import authMiddleware from '@/pages/api/authMiddleware';
import { pool } from '@/config/db';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  // Middleware de autenticación
  authMiddleware(req, res, async () => {
    try {
      const usuarioId = req.user.id; // ID del usuario autenticado

      // Consulta: tareas asignadas al usuario actual
      const [tareas] = await pool.query(`
        SELECT 
          t.id,
          t.nombre AS tarea_nombre,
          t.descripcion AS tarea_descripcion,
          t.estado,
          p.nombre AS proyecto_nombre
        FROM tareas t
        INNER JOIN proyectos p ON t.proyecto_id = p.id
        WHERE t.asignado_a = ?
      `, [usuarioId]);

      // Verificación si no tiene tareas asignadas
      if (tareas.length === 0) {
        return res.status(404).json({ mensaje: 'No tienes tareas asignadas' });
      }

      return res.status(200).json({ tareas });
    } catch (error) {
      console.error('Error al obtener las tareas:', error);
      return res.status(500).json({ error: 'Error en el servidor al obtener las tareas asignadas' });
    }
  });
}