import { connectDB } from "../db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  const { nombre_usuario, contrasena } = req.body;

  try {
    const db = await connectDB();
    const result = await db
      .request()
      .input("nombre_usuario", sql.VarChar, nombre_usuario)
      .query("SELECT * FROM Usuarios WHERE nombre_usuario = @nombre_usuario");

    if (result.recordset.length === 0) {
      return res.status(401).json({ error: "Usuario no encontrado" });
    }

    const usuario = result.recordset[0];

    const match = await bcrypt.compare(contrasena, usuario.contrasena);
    if (!match) {
      return res.status(401).json({ error: "Contraseña incorrecta" });
    }

    const token = jwt.sign(
      { id: usuario.id, rol_id: usuario.rol_id },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );

    res.json({ token, usuario });
  } catch (error) {
    res.status(500).json({ error: "Error en el servidor" });
  }
}
