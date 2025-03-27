// src/lib/proyectos.js
import { pool } from '@/config/db';

// Obtener proyecto por ID
export async function getProyectoPorId(id) {
    try {
        const [rows] = await pool.query('SELECT * FROM proyectos WHERE id = ?', [id]);
        return rows.length > 0 ? rows[0] : null;
    } catch (error) {
        throw new Error('Error al obtener el proyecto');
    }
}

// Actualizar proyecto
export async function actualizarProyecto(id, { nombre, descripcion, fecha_inicio, fecha_fin }) {
    try {
        const [result] = await pool.query(
            'UPDATE proyectos SET nombre = ?, descripcion = ?, fecha_inicio = ?, fecha_fin = ? WHERE id = ?',
            [nombre, descripcion, fecha_inicio, fecha_fin, id]
        );
        return result.affectedRows > 0;
    } catch (error) {
        throw new Error('Error al actualizar el proyecto');
    }
}

// Eliminar proyecto
export async function eliminarProyecto(id) {
    try {
        const [result] = await pool.query('DELETE FROM proyectos WHERE id = ?', [id]);
        return result.affectedRows > 0;
    } catch (error) {
        throw new Error('Error al eliminar el proyecto');
    }
}

// Obtener proyectos basados en tareas asignadas a un usuario
export async function getProyectosPorUsuario(usuarioId) {
    try {
        const [rows] = await pool.query(
            `SELECT DISTINCT p.* FROM proyectos p 
            JOIN tareas t ON p.id = t.proyecto_id 
            WHERE t.usuario_id = ?`,
            [usuarioId]
        );
        return rows;
    } catch (error) {
        throw new Error('Error al obtener proyectos del usuario');
    }
}
