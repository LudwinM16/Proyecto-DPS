import { pool } from '@/config/db';

export default async function handler(req, res) {
  switch (req.method) {
    case 'GET':
      return obtenerRoles(res);
    case 'POST':
      return crearRol(req, res);
    case 'PUT':
      return actualizarRol(req, res);
    case 'DELETE':
      return eliminarRol(req, res);
    default:
      return res.status(405).json({ error: 'Método no permitido' });
  }
}

// Obtener todos los roles
const obtenerRoles = async (res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM roles');
    return res.status(200).json(rows);
  } catch (error) {
    return res.status(500).json({ error: 'Error al obtener roles' });
  }
};

// Crear un nuevo rol
const crearRol = async (req, res) => {
  try {
    const { nombre_rol } = req.body;
    if (!nombre_rol) {
      return res.status(400).json({ error: 'El nombre del rol es obligatorio' });
    }

    const [result] = await pool.query('INSERT INTO roles (nombre_rol) VALUES (?)', [nombre_rol]);
    return res.status(201).json({ id: result.insertId, nombre_rol });
  } catch (error) {
    return res.status(500).json({ error: 'Error al crear el rol' });
  }
};

// Actualizar un rol
const actualizarRol = async (req, res) => {
  try {
    const { id, nombre_rol } = req.body;
    if (!id || !nombre_rol) {
      return res.status(400).json({ error: 'ID y nombre del rol son obligatorios' });
    }

    const [result] = await pool.query('UPDATE roles SET nombre_rol = ? WHERE id = ?', [nombre_rol, id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Rol no encontrado' });
    }

    return res.status(200).json({ id, nombre_rol });
  } catch (error) {
    return res.status(500).json({ error: 'Error al actualizar el rol' });
  }
};

// Eliminar un rol
const eliminarRol = async (req, res) => {
  try {
    const { id } = req.body;
    if (!id) {
      return res.status(400).json({ error: 'El ID del rol es obligatorio' });
    }

    const [result] = await pool.query('DELETE FROM roles WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Rol no encontrado' });
    }

    return res.status(200).json({ message: 'Rol eliminado correctamente' });
  } catch (error) {
    return res.status(500).json({ error: 'Error al eliminar el rol' });
  }
};
