import mysql from 'mysql2/promise';



export const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '1234567890',
  database: 'gestion_proyectos',
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
