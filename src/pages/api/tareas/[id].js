import { obtenerTareaPorId, actualizarTarea, eliminarTarea } from '@/lib/tareas';

export default async function handler(req, res) {
    const { id } = req.query;

    if (!id) {
        return res.status(400).json({ message: 'Falta el ID de la tarea' });
    }

    switch (req.method) {
        case 'GET':
            try {
                const tarea = await obtenerTareaPorId(id);
                if (!tarea) {
                    return res.status(404).json({ message: 'Tarea no encontrada' });
                }
                res.status(200).json(tarea);
            } catch (error) {
                res.status(500).json({ message: error.message });
            }
            break;

        case 'PUT':
            try {
                const resultado = await actualizarTarea(id, req.body);
                if (!resultado) {
                    return res.status(404).json({ message: 'Tarea no encontrada' });
                }
                res.status(200).json(resultado);
            } catch (error) {
                res.status(500).json({ message: error.message });
            }
            break;

        case 'DELETE':
            try {
                const resultado = await eliminarTarea(id);
                if (!resultado) {
                    return res.status(404).json({ message: 'Tarea no encontrada' });
                }
                res.status(200).json(resultado);
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
