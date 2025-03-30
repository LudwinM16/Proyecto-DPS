import formidable from 'formidable';
import fs from 'fs';
import { exec } from 'child_process';
import { promisify } from 'util';

// Convierte `exec` en una función que retorna promesas
const execAsync = promisify(exec);

// Configuración para que Next.js no use bodyParser (porque formidable se encarga del parseo)
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Método no permitido' });

    // Inicializa el parser de archivos
    const form = new formidable.IncomingForm();

      // Procesa el formulario recibido
    form.parse(req, async (err, fields, files) => {
        if (err) {
            console.error('Error al procesar archivo:', err);
            return res.status(500).json({ error: 'Error al procesar archivo' });
        }

        // Obtiene la ruta temporal del archivo subido
        const filePath = files.archivo.filepath; 

         // Extrae las credenciales de conexión desde variables de entorno
        const { MYSQL_DATABASE, MYSQL_USER, MYSQL_PASSWORD, MYSQL_HOST } = process.env;

        try {
            // Comando para restaurar la base de datos usando el archivo .sql
            const cmd = `mysql -h ${MYSQL_HOST} -u ${MYSQL_USER} -p${MYSQL_PASSWORD} ${MYSQL_DATABASE} < ${filePath}`;
            await execAsync(cmd);

            res.status(200).json({ mensaje: 'Base de datos restaurada correctamente' });
        } catch (error) {
            console.error('Error al restaurar base de datos:', error);
            res.status(500).json({ error: 'Error al restaurar base de datos' });
        }
    });
}
