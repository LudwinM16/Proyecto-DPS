import { getProyectoPorId, actualizarProyecto, eliminarProyecto } from '@/lib/proyectos';

export default async function handler(req, res) {
    const { id } = req.query;

    if (!id) {
        return res.status(400).json({ message: 'Falta el ID del proyecto' });
    }

    switch (req.method) {
        case 'GET':
            try {
                const proyecto = await getProyectoPorId(id);
                if (!proyecto) {
                    return res.status(404).json({ message: 'Proyecto no encontrado' });
                }
                res.status(200).json(proyecto);
            } catch (error) {
                res.status(500).json({ message: error.message });
            }
            break;

        case 'PUT':
            try {
                const { nombre, descripcion, fecha_inicio, fecha_fin } = req.body;
                if (!nombre || !descripcion || !fecha_inicio || !fecha_fin) {
                    return res.status(400).json({ message: 'Todos los campos son obligatorios' });
                }

                const actualizado = await actualizarProyecto(id, { nombre, descripcion, fecha_inicio, fecha_fin });
                if (!actualizado) {
                    return res.status(404).json({ message: 'Proyecto no encontrado' });
                }

                res.status(200).json({ message: 'Proyecto actualizado correctamente' });
            } catch (error) {
                res.status(500).json({ message: error.message });
            }
            break;

        case 'DELETE':
            try {
                const eliminado = await eliminarProyecto(id);
                if (!eliminado) {
                    return res.status(404).json({ message: 'Proyecto no encontrado' });
                }

                res.status(200).json({ message: 'Proyecto eliminado correctamente' });
            } catch (error) {
                res.status(500).json({ message: error.message });
            }
            break;

        default:
            res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
            res.status(405).json({ message: `Método ${req.method} no permitido` });
            break;
    }
}
