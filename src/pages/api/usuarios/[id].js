import { getUsuarioPorId, actualizarUsuario, eliminarUsuario } from '@/lib/usuarios';

export default async function handler(req, res) {
    const { id } = req.query;

    if (!id) {
        return res.status(400).json({ message: 'Falta el ID del usuario' });
    }

    switch (req.method) {
        case 'GET':
            try {
                const usuario = await getUsuarioPorId(id);
                if (!usuario) {
                    return res.status(404).json({ message: 'Usuario no encontrado' });
                }
                res.status(200).json(usuario);
            } catch (error) {
                console.error('Error al obtener usuario:', error);
                res.status(500).json({ message: 'Error al obtener el usuario' });
            }
            break;

        case 'PUT':
            try {
                const usuarioActualizado = await actualizarUsuario(id, req.body);
                res.status(200).json(usuarioActualizado);
            } catch (error) {
                console.error('Error al actualizar usuario:', error);
                res.status(500).json({ message: 'Error al actualizar el usuario' });
            }
            break;

        case 'DELETE':
            try {
                await eliminarUsuario(id);
                res.status(200).json({ message: 'Usuario eliminado correctamente' });
            } catch (error) {
                console.error('Error al eliminar usuario:', error);
                res.status(500).json({ message: 'Error al eliminar el usuario' });
            }
            break;

        default:
            res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
            res.status(405).end(`Método ${req.method} no permitido`);
            break;
    }
}
