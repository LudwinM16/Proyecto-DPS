import formidable from 'formidable';
import fs from 'fs';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Método no permitido' });

    const form = new formidable.IncomingForm();

    form.parse(req, async (err, fields, files) => {
        if (err) {
            console.error('Error al procesar archivo:', err);
            return res.status(500).json({ error: 'Error al procesar archivo' });
        }

        const filePath = files.archivo.filepath; 

        const { MYSQL_DATABASE, MYSQL_USER, MYSQL_PASSWORD, MYSQL_HOST } = process.env;

        try {
            const cmd = `mysql -h ${MYSQL_HOST} -u ${MYSQL_USER} -p${MYSQL_PASSWORD} ${MYSQL_DATABASE} < ${filePath}`;
            await execAsync(cmd);

            res.status(200).json({ mensaje: 'Base de datos restaurada correctamente' });
        } catch (error) {
            console.error('Error al restaurar base de datos:', error);
            res.status(500).json({ error: 'Error al restaurar base de datos' });
        }
    });
}
