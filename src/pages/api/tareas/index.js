import { pool } from '@/config/db';
import authMiddleware from '@/pages/api/authMiddleware';

export default async function handler(req, res) {
    await authMiddleware(req, res, async () => { // Proteger la ruta

        switch (req.method) {
            case 'GET':
                // Solo los miembros del equipo pueden ver sus propias tareas
                if (req.user.rol_id !== 3) {
                    return res.status(403).json({ error: 'Acceso denegado. Solo los miembros del equipo pueden ver sus tareas.' });
                }
                return await obtenerTareas(req, res);

            case 'POST':
                // **Permitir que administradores (rol_id === 1) y gerentes (rol_id === 2) asignen tareas**
                if (req.user.rol_id !== 2 && req.user.rol_id !== 1) {
                    return res.status(403).json({ error: 'Acceso denegado. Solo los administradores y gerentes pueden asignar tareas.' });
                }
                return await crearTarea(req, res);

            default:
                return res.status(405).json({ mensaje: "Método no permitido" });
        }
    });
}

// Obtener solo las tareas asignadas al usuario autenticado
const obtenerTareas = async (req, res) => {
    try {
        const [tareas] = await pool.query("SELECT * FROM Tareas WHERE asignado_a = ?", [req.user.id]);
        res.status(200).json(tareas);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al obtener tareas", error });
    }
};

// Crear nueva tarea (solo para administradores y gerentes)
const crearTarea = async (req, res) => {
    try {
        const { nombre, descripcion, estado, proyecto_id, asignado_a } = req.body;

        if (!nombre || !descripcion || !proyecto_id || !asignado_a) {
            return res.status(400).json({ error: "Todos los campos son obligatorios" });
        }

        const [resultado] = await pool.query(
            "INSERT INTO Tareas (nombre, descripcion, estado, proyecto_id, asignado_a) VALUES (?, ?, ?, ?, ?)",
            [nombre, descripcion, estado || "Pendiente", proyecto_id, asignado_a]
        );

        res.status(201).json({ mensaje: "Tarea creada con éxito", id: resultado.insertId });
    } catch (error) {
        res.status(500).json({ mensaje: "Error al crear tarea", error });
    }
};