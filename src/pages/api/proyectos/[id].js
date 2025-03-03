import db from "@/config/db";

export default async function handler(req, res) {
    const { id } = req.query;
    
    if (req.method === "GET") {
        try {
            const [rows] = await db.execute("SELECT * FROM Proyectos WHERE id = ?", [id]);
            if (rows.length === 0) {
                return res.status(404).json({ message: "Proyecto no encontrado" });
            }
            res.status(200).json(rows[0]);
        } catch (error) {
            res.status(500).json({ message: "Error al obtener el proyecto" });
        }
    } else if (req.method === "PUT") {
        const { nombre, descripcion, fecha_inicio, fecha_fin, gerente_id } = req.body;
        try {
            await db.execute(
                "UPDATE Proyectos SET nombre = ?, descripcion = ?, fecha_inicio = ?, fecha_fin = ?, gerente_id = ? WHERE id = ?",
                [nombre, descripcion, fecha_inicio, fecha_fin, gerente_id, id]
            );
            res.status(200).json({ message: "Proyecto actualizado correctamente" });
        } catch (error) {
            res.status(500).json({ message: "Error al actualizar el proyecto" });
        }
    } else if (req.method === "DELETE") {
        try {
            await db.execute("DELETE FROM Proyectos WHERE id = ?", [id]);
            res.status(200).json({ message: "Proyecto eliminado correctamente" });
        } catch (error) {
            res.status(500).json({ message: "Error al eliminar el proyecto" });
        }
    } else {
        res.status(405).json({ message: "Método no permitido" });
    }
}
