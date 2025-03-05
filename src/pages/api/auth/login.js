import { pool } from '@/config/db';
import bcrypt from "bcryptjs"; // Usa bcryptjs en lugar de bcrypt
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  const { nombre_usuario, contrasena } = req.body;

  if (!nombre_usuario || !contrasena) {
    return res.status(400).json({ error: "Todos los campos son obligatorios" });
  }

  try {
    // Buscar usuario en la base de datos
    const [rows] = await pool.execute(
      "SELECT * FROM usuarios WHERE nombre_usuario = ?",
      [nombre_usuario]
    );

    if (rows.length === 0) {
      return res.status(401).json({ error: "Usuario no encontrado" });
    }

    const usuario = rows[0];

    // Comparar contraseña encriptada
    const match = await bcrypt.compare(contrasena, usuario.contrasena);
    if (!match) {
      return res.status(401).json({ error: "Contraseña incorrecta" });
    }

// Cambia el valor de 'mi_secreto' por una cadena secreta más segura
const token = jwt.sign(
  { id: usuario.id, rol_id: usuario.rol_id },
  'b8b4eec6d2e5a1f0b8f8b263f92b3c83f053e0f1e9e601f8b8d37fa488d15d4e',  // Aquí el secreto directo
  { expiresIn: "8h" }
);

    return res.status(200).json({ mensaje: "Inicio de sesión exitoso", token, usuario });
  } catch (error) {
    console.error("Error en el login:", error);
    return res.status(500).json({ error: "Error en el servidor" });
  }
}