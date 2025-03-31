import authMiddleware from '@/pages/api/authMiddleware';
import { pool } from '@/pages/api/db';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  authMiddleware(req, res, async () => {
    try {
      const usuarioId = req.user.id;
      // Listar Tareas disponibles para usuario
      const [tareas] = await pool.query(`
        SELECT
          t.id,
          t.nombre AS tarea_nombre,
          t.descripcion AS tarea_descripcion,
          t.estado,
          t.porcentaje_avance,
          p.nombre AS proyecto_nombre
        FROM tareas t
        INNER JOIN proyectos p ON t.proyecto_id = p.id
        WHERE t.asignado_a = ?
      `, [usuarioId]);

      if (tareas.length === 0) {
        return res.status(200).json({ tareas: [] });
      }
      //Listar comentarios por cada tarea
      const tareasConComentarios = await Promise.all(
        tareas.map(async (tarea) => {
          const [comentarios] = await pool.query(`
            SELECT
              id_comentario AS id_comentario,
              comentario,
              porcentaje
            FROM comentarios_tareas
            WHERE id_tarea = ?
            ORDER BY id_comentario ASC
          `, [tarea.id]);

          return {
            ...tarea,
            comentarios: comentarios.length > 0 ? comentarios : []
          };
        })
      );

      return res.status(200).json({ tareas: tareasConComentarios });
    } catch (error) {
      console.error('Error al obtener las tareas y comentarios:', error);
      return res.status(500).json({ error: 'Error en el servidor al obtener las tareas y comentarios' });
    }
  });
}
