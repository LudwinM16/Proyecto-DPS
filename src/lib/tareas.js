import { pool } from '@/config/db';

export async function obtenerTareas() {
    try {
        const [result] = await pool.query('SELECT * FROM Tareas');
        return result;
    } catch (error) {
        throw new Error('Error al obtener tareas');
    }
}

export async function obtenerTareaPorId(id) {
    try {
        const [result] = await pool.query('SELECT * FROM Tareas WHERE id = ?', [id]);
        return result.length ? result[0] : null;
    } catch (error) {
        throw new Error('Error al obtener la tarea');
    }
}

export async function crearTarea({ nombre, descripcion, proyecto_id, estado }) {
    try {
        const [result] = await pool.query(
            'INSERT INTO Tareas (nombre, descripcion, proyecto_id, estado) VALUES (?, ?, ?, ?)',
            [nombre, descripcion, proyecto_id, estado || 'pendiente']
        );

        return { id: result.insertId, nombre, descripcion, proyecto_id, estado: estado || 'pendiente' };
    } catch (error) {
        throw new Error('Error al crear la tarea');
    }
}

export async function actualizarTarea(id, { nombre, descripcion, proyecto_id, estado }) {
    try {
        const [result] = await pool.query(
            'UPDATE Tareas SET nombre = ?, descripcion = ?, proyecto_id = ?, estado = ? WHERE id = ?',
            [nombre, descripcion, proyecto_id, estado, id]
        );

        return result.affectedRows > 0 ? { message: 'Tarea actualizada correctamente' } : null;
    } catch (error) {
        throw new Error('Error al actualizar la tarea');
    }
}

export async function eliminarTarea(id) {
    try {
        const [result] = await pool.query('DELETE FROM Tareas WHERE id = ?', [id]);

        return result.affectedRows > 0 ? { message: 'Tarea eliminada correctamente' } : null;
    } catch (error) {
        throw new Error('Error al eliminar la tarea');
    }
}
