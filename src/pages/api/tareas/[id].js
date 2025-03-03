import { conectarDB } from "@/utils/db";

export default async function handler(req, res) {
  const { id } = req.query;
  const db = await conectarDB();

  if (req.method === "GET") {
    try {
      const [rows] = await db.query("SELECT * FROM Tareas WHERE id = ?", [id]);
      if (rows.length === 0) {
        return res.status(404).json({ error: "Tarea no encontrada" });
      }
      res.status(200).json(rows[0]);
    } catch (error) {
      res.status(500).json({ error: "Error al obtener la tarea" });
    }
  } else if (req.method === "PATCH") {
    const { nombre, descripcion, estado, proyecto_id, asignado_a } = req.body;
    try {
      const [result] = await db.query(
        "UPDATE Tareas SET nombre = ?, descripcion = ?, estado = ?, proyecto_id = ?, asignado_a = ? WHERE id = ?",
        [nombre, descripcion, estado, proyecto_id, asignado_a, id]
      );
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Tarea no encontrada" });
      }
      res.status(200).json({ id, ...req.body });
    } catch (error) {
      res.status(500).json({ error: "Error al actualizar la tarea" });
    }
  } else if (req.method === "DELETE") {
    try {
      const [result] = await db.query("DELETE FROM Tareas WHERE id = ?", [id]);
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Tarea no encontrada" });
      }
      res.status(200).json({ message: "Tarea eliminada" });
    } catch (error) {
      res.status(500).json({ error: "Error al eliminar la tarea" });
    }
  } else {
    res.setHeader("Allow", ["GET", "PATCH", "DELETE"]);
    res.status(405).end(`Método ${req.method} no permitido`);
  }
}
