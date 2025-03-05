import { pool } from '@/config/db';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const [rows] = await pool.query('SELECT * FROM usuarios');
      return res.status(200).json(rows);
    } catch (error) {
      return res.status(500).json({ error: 'Error al obtener usuarios' });
    }
  }

  if (req.method === 'POST') {
    try {
      const { nombre_usuario, contrasena, rol_id } = req.body;

      // Validar que todos los campos obligatorios estén presentes
      if (!nombre_usuario || !contrasena) {
        return res.status(400).json({ error: 'El nombre de usuario y la contraseña son obligatorios' });
      }

      // Insertar en la base de datos
      const [result] = await pool.query(
        'INSERT INTO usuarios (nombre_usuario, contrasena, rol_id) VALUES (?, ?, ?)',
        [nombre_usuario, contrasena, rol_id || null] // Si rol_id es opcional, se pone null por defecto
      );

      res.status(201).json({ id: result.insertId, nombre_usuario, rol_id });
    } catch (error) {
      console.error('Error al crear usuario:', error);
      res.status(500).json({ error: 'Error al crear usuario' });
    }
  } else {
    res.status(405).json({ error: 'Método no permitido' });
  }


}
