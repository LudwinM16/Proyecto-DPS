import { getUsuarioPorId, actualizarUsuario, eliminarUsuario } from '@/services/usuarios';

export default async function handler(req, res) {
    const { id } = req.query;

    switch (req.method) {
        case 'GET':
            try {
                const usuario = await getUsuarioPorId(id);
                if (!usuario) {
                    return res.status(404).json({ message: 'Usuario no encontrado' });
                }
                res.status(200).json(usuario);
            } catch (error) {
                res.status(500).json({ message: 'Error al obtener el usuario' });
            }
            break;

        case 'PUT':
            try {
                const usuarioActualizado = await actualizarUsuario(id, req.body);
                res.status(200).json(usuarioActualizado);
            } catch (error) {
                res.status(500).json({ message: 'Error al actualizar el usuario' });
            }
            break;

        case 'DELETE':
            try {
                await eliminarUsuario(id);
                res.status(200).json({ message: 'Usuario eliminado correctamente' });
            } catch (error) {
                res.status(500).json({ message: 'Error al eliminar el usuario' });
            }
            break;

        default:
            res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
            res.status(405).end(`Método ${req.method} no permitido`);
            break;
    }
}
