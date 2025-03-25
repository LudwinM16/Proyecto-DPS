import authMiddleware from '@/pages/api/authMiddleware';
import { pool } from '@/pages/api/db';

export default async function handler(req, res) {
  const {
    query: { id },
    method,
  } = req;

  authMiddleware(req, res, async () => {
    switch (method) {
      case 'GET':
        try {
          const [tareaRows] = await pool.query(
            `
            SELECT 
              t.id,
              t.nombre,
              t.descripcion,
              t.estado,
              t.porcentaje_avance,
              p.nombre AS proyecto_nombre
            FROM tareas t
            INNER JOIN proyectos p ON t.proyecto_id = p.id
            WHERE t.id = ?
            `,
            [id]
          );

          if (tareaRows.length === 0) {
            return res.status(404).json({ message: 'Tarea no encontrada' });
          }

          const tarea = tareaRows[0];

          const [comentarios] = await pool.query(
            `
            SELECT 
              id_comentario,
              comentario,
              porcentaje
            FROM comentarios_tareas
            WHERE id_tarea = ?
            ORDER BY id_comentario ASC
            `,
            [id]
          );

          return res.status(200).json({
            tarea,
            comentarios,
          });
        } catch (error) {
          console.error('Error al obtener la tarea:', error);
          return res.status(500).json({ error: 'Error al obtener la tarea' });
        }

      case 'POST':
        try {
          const { comentario, porcentaje } = req.body;

          if (!comentario || porcentaje == null) {
            return res
              .status(400)
              .json({ error: 'Comentario y porcentaje son obligatorios' });
          }

          const [result] = await pool.query(
            `
            INSERT INTO comentarios_tareas (id_tarea, comentario, porcentaje)
            VALUES (?, ?, ?)
            `,
            [id, comentario, porcentaje]
          );

          return res.status(200).json({
            message: 'Comentario registrado correctamente',
            id_comentario: result.insertId,
          });
        } catch (error) {
          console.error('Error al registrar el comentario:', error);
          return res
            .status(500)
            .json({ error: 'Error al registrar el comentario' });
        }

      case 'PATCH':
        try {
          const { porcentaje, comentario } = req.body;

          if (porcentaje == null || comentario == null) {
            return res
              .status(400)
              .json({ error: 'Comentario y porcentaje son obligatorios' });
          }

          // Validar porcentaje anterior
          const [tareaActualRows] = await pool.query(
            `SELECT porcentaje_avance FROM tareas WHERE id = ?`,
            [id]
          );

          if (tareaActualRows.length === 0) {
            return res.status(404).json({ message: 'Tarea no encontrada' });
          }

          const porcentajeAnterior = tareaActualRows[0].porcentaje_avance;

          if (porcentaje < porcentajeAnterior) {
            return res.status(400).json({
              error: `El porcentaje no puede ser menor al actual (${porcentajeAnterior}%)`,
            });
          }

          if (porcentaje > 100) {
            return res.status(400).json({
              error: 'El porcentaje no puede ser mayor a 100%',
            });
          }

          // Actualizamos porcentaje y estado si es 100%
          const estadoActualizado = porcentaje === 100 ? 'Completada' : 'En progreso';

          await pool.query(
            `
            UPDATE tareas
            SET porcentaje_avance = ?, estado = ?
            WHERE id = ?
            `,
            [porcentaje, estadoActualizado, id]
          );

          // Insertamos comentario con el porcentaje
          const [result] = await pool.query(
            `
            INSERT INTO comentarios_tareas (id_tarea, comentario, porcentaje)
            VALUES (?, ?, ?)
            `,
            [id, comentario, porcentaje]
          );

          return res.status(200).json({
            message: 'Tarea actualizada y comentario agregado correctamente',
            id_comentario: result.insertId,
          });
        } catch (error) {
          console.error('Error en PATCH:', error);
          return res.status(500).json({
            error: 'Error al actualizar la tarea y agregar el comentario',
          });
        }

      default:
        res.setHeader('Allow', ['GET', 'POST', 'PATCH']);
        return res.status(405).json({ error: `Método ${method} no permitido` });
    }
  });
}
