import { pool } from '@/config/db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Método no permitido" });
    }

    const { nombre_usuario, contrasena } = req.body;

    if (!nombre_usuario || !contrasena) {
        return res.status(400).json({ error: "Todos los campos son obligatorios" });
    }

    try {
        const [rows] = await pool.execute(
            "SELECT id, nombre_usuario, contrasena, rol_id FROM usuarios WHERE nombre_usuario = ?",
            [nombre_usuario]
        );

        if (rows.length === 0) {
            return res.status(401).json({ error: "Usuario no encontrado" });
        }

        const usuario = rows[0];

        console.log("Cuerpo recibido:", req.body); 
        console.log("Contraseña ingresada (Texto plano):", contrasena);
        console.log("Contraseña almacenada en BD (Hash):", usuario.contrasena);
        console.log("JWT_SECRET:", process.env.JWT_SECRET);

        if (!usuario.contrasena) {
            return res.status(500).json({ error: "Error en el servidor: La contraseña en BD es inválida." });
        }

        const match = await bcrypt.compare(contrasena, usuario.contrasena);
        if (!match) {
            return res.status(401).json({ error: "Contraseña incorrecta" });
        }

        // Usar JWT_SECRET de entorno o uno por defecto si no está definido
        const jwtSecret = process.env.JWT_SECRET || 'secreto_predeterminado_para_testing';

        const token = jwt.sign(
            {
                id: usuario.id,
                rol: usuario.rol_id,
                nombre_usuario: usuario.nombre_usuario
            },
            jwtSecret,
            { expiresIn: '8h' }
        );

        await pool.query(
            'INSERT INTO actividad (accion, descripcion, usuario_id) VALUES (?, ?, ?)',
            ['LOGIN', `Inicio de sesión exitoso`, usuario.id]
        );

        return res.status(200).json({
            mensaje: "Inicio de sesión exitoso",
            token,
            usuario: {
                id: usuario.id,
                nombre_usuario: usuario.nombre_usuario,
                rol_id: usuario.rol_id
            }
        });

    } catch (error) {
        console.error("Error en el login:", error);
        return res.status(500).json({ error: "Error interno del servidor" });
    }
}
