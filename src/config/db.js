import * as mysql from 'mysql2/promise';




export const pool = mysql.createPool({
  host: 'bss8ztfozyeuhmb0ted5-mysql.services.clever-cloud.com',
  user: 'ulc3mgmqnfmgjuh4',
  password: 'PWJvovdA0i2HfQ1Dx4La',
  database: 'bss8ztfozyeuhmb0ted5',
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
