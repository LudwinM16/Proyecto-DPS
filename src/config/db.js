import * as mysql from 'mysql2/promise';




export const pool = mysql.createPool({
  host: 'sql112.infinityfree.com',
  user: 'if0_38614292',
  password: 'proyectodps123',
  database: 'if0_38614292_gestionproyectos',
  port: 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Prueba la conexión
(async () => {
    try {
      const connection = await pool.getConnection();
      console.log('✅ Conectado a la base de datos');
      connection.release();
    } catch (error) {
      console.error('❌ Error al conectar a la base de datos:', error.message);
    }
  })();
