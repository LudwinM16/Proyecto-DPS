import { exec } from 'child_process';
import path from 'path';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {

      // Generar un nombre de archivo único con la fecha y hora actual
      const fecha = new Date().toISOString().replace(/[-:T]/g, '').split('.')[0]; 
      const nombreRespaldo = `respaldo_${fecha}.sql`;
      // Definir la ruta completa donde se guardará el archivo .sql
      const rutaArchivo = path.join(process.cwd(), 'public', nombreRespaldo);

      // Datos de conexión a la base de datos
      const host = 'localhost'; 
      const usuario = 'usuariodps';
      const password = '123456';
      const nombreBase = 'gestion_proyectos'; 

      const mysqldumpPath = '"C:\\xampp\\mysql\\bin\\mysqldump.exe"';

      // Comando completo para generar el respaldo y guardarlo en el archivo
      const comando = `${mysqldumpPath} -h ${host} -u ${usuario} ${password ? `-p${password}` : ''} ${nombreBase} > "${rutaArchivo}"`;

      console.log("Comando generado:", comando); 

      // Ejecutar el comando en la terminal del servidor
      exec(comando, (error, stdout, stderr) => {
        if (error) {
          console.error('Error al generar respaldo:', error);
          return res.status(500).json({ mensaje: 'Error al generar respaldo', error });
        }

        console.log('Respaldo generado exitosamente:', nombreRespaldo);
        res.status(200).json({ mensaje: 'Respaldo generado exitosamente', archivo: `/public/${nombreRespaldo}` });
      });

    } catch (err) {
      console.error('Error general:', err);
      res.status(500).json({ mensaje: 'Error inesperado al generar respaldo', err });
    }
  } else {
    // Si el método HTTP no es GET, responde con error 405 (método no permitido)
    res.status(405).json({ mensaje: 'Método no permitido' });
  }
}
