import { pool } from '../config/db';
import bcrypt from 'bcryptjs';

export async function getUsuarioPorId(id) {
    try {
        const [rows] = await pool.query('SELECT * FROM Usuarios WHERE id = ?', [id]);
        return rows.length > 0 ? rows[0] : { message: 'Usuario no encontrado' };
    } catch (error) {
        return { message: 'Error al obtener el usuario' };
    }
}

export async function actualizarUsuario(id, data) {
    try {
        if (!data.nombre_usuario || !data.contrasena || !data.rol_id) {
            return { message: "Faltan datos: nombre_usuario, contrasena y rol_id son obligatorios" };
        }

        const [result] = await pool.query(
            'UPDATE usuarios SET nombre_usuario = ?, contrasena = ?, rol_id = ? WHERE id = ?',
            [data.nombre_usuario, data.contrasena, data.rol_id, id]
        );

        if (result.affectedRows === 0) {
            return { message: "No se encontró el usuario para actualizar" };
        }

        return { message: "Usuario actualizado correctamente", id, ...data };
    } catch (error) {
        return { message: `Error al actualizar el usuario: ${error.message}` };
    }
}

export async function agregarUsuario({ nombre_usuario, contrasena, rol_id }) {
    try {
        if (!nombre_usuario || !contrasena) {
            return { message: "El nombre de usuario y la contraseña son obligatorios" };
        }

        // Encriptar la contraseña antes de guardarla en la base de datos
        const salt = await bcrypt.genSalt(10);
        const hashContrasena = await bcrypt.hash(contrasena, salt);

        const [result] = await pool.query(
            'INSERT INTO usuarios (nombre_usuario, contrasena, rol_id) VALUES (?, ?, ?)',
            [nombre_usuario, hashContrasena, rol_id || 3] // Si no se define rol, asigna 3 (Miembro)
        );

        return { 
            id: result.insertId, 
            nombre_usuario, 
            rol_id: rol_id || 3, 
            message: "Usuario creado exitosamente" 
        };
    } catch (error) {
        console.error("Error al agregar usuario:", error);
        return { message: `Error al crear usuario: ${error.message}` };
    }
}


export async function eliminarUsuario(id) {
    try {
        const [result] = await pool.query('DELETE FROM Usuarios WHERE id = ?', [id]);

        return result.affectedRows > 0
            ? { message: 'Usuario eliminado correctamente' }
            : { message: 'Usuario no encontrado' };
    } catch (error) {
        return { message: 'Error al eliminar el usuario' };
    }
}
