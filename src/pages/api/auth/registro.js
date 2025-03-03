import { hashPassword } from "@/utils/auth";
import { db } from "@/utils/db";

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ mensaje: "Método no permitido" });
    }

    const { nombre_usuario, contrasena, rol_id } = req.body;

    if (!nombre_usuario || !contrasena || !rol_id) {
        return res.status(400).json({ mensaje: "Todos los campos son obligatorios" });
    }

    try {
        const hashedPassword = await hashPassword(contrasena);
        
        const [result] = await db.execute(
            "INSERT INTO Usuarios (nombre_usuario, contrasena, rol_id) VALUES (?, ?, ?)",
            [nombre_usuario, hashedPassword, rol_id]
        );

        return res.status(201).json({ mensaje: "Usuario registrado exitosamente", usuarioId: result.insertId });
    } catch (error) {
        console.error("Error al registrar usuario:", error);
        return res.status(500).json({ mensaje: "Error interno del servidor" });
    }
}
