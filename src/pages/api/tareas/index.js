import { pool } from "@/config/db";

export default async function handler(req, res) {
    switch (req.method) {
        case "GET":
            return await obtenerTareas(req, res);
        case "POST":
            return await crearTarea(req, res);
        default:
            return res.status(405).json({ mensaje: "Método no permitido" });
    }
}

const obtenerTareas = async (req, res) => {
    try {
        const [tareas] = await pool.query("SELECT * FROM Tareas");
        res.status(200).json(tareas);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al obtener tareas", error });
    }
};

const crearTarea = async (req, res) => {
    try {
        const { nombre, descripcion, estado, proyecto_id, asignado_a } = req.body;
        console.log(req.body);
        const resultado = await pool.query(
            "INSERT INTO Tareas (nombre, descripcion, estado, proyecto_id, asignado_a) VALUES (?, ?, ?, ?, ?)",
            [nombre, descripcion, estado || "Pendiente", proyecto_id, asignado_a]
        );
        res.status(201).json({ mensaje: "Tarea creada con éxito", id: resultado.insertId });
    } catch (error) {
        res.status(500).json({ mensaje: "Error al crear tarea", error });
    }
};
