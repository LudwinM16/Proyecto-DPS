import db from "@/src/lib/db";

export default async function handler(req, res) {
    switch (req.method) {
        case "GET":
            return obtenerProyectos(req, res);
        case "POST":
            return crearProyecto(req, res);
        default:
            return res.status(405).json({ mensaje: "Método no permitido" });
    }
}

async function obtenerProyectos(req, res) {
    try {
        const [rows] = await db.query("SELECT * FROM Proyectos");
        return res.status(200).json(rows);
    } catch (error) {
        return res.status(500).json({ mensaje: "Error al obtener proyectos" });
    }
}

async function crearProyecto(req, res) {
    try {
        const { nombre, descripcion, fecha_inicio, fecha_fin, gerente_id } = req.body;
        if (!nombre || !gerente_id) {
            return res.status(400).json({ mensaje: "Nombre y gerente_id son obligatorios" });
        }

        const [result] = await db.query(
            "INSERT INTO Proyectos (nombre, descripcion, fecha_inicio, fecha_fin, gerente_id) VALUES (?, ?, ?, ?, ?)",
            [nombre, descripcion, fecha_inicio, fecha_fin, gerente_id]
        );
        
        return res.status(201).json({ id: result.insertId, nombre, descripcion, fecha_inicio, fecha_fin, gerente_id });
    } catch (error) {
        return res.status(500).json({ mensaje: "Error al crear el proyecto" });
    }
}