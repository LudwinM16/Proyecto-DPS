// lib/db.js
const sql = require('mssql');

// Función para verificar las variables de entorno
function getEnvVar(variable) {
  const value = process.env[variable];
  if (!value) {
    throw new Error(`Environment variable ${variable} is not defined`);
  }
  return value;
}

const config = {
  user: getEnvVar('proyectoDPS'), // Lanza error si no está definido
  password: getEnvVar('DPS'),
  server: getEnvVar('localhost:3000'),
  database: getEnvVar('gestionproyectos'),
  options: {
    encrypt: true,
    trustServerCertificate: false,
  }
};

let pool = null;

async function getConnection() {
  if (!pool) {
    try {
      pool = await sql.connect(config);
      console.log('Connected to SQL Server');
    } catch (err) {
      console.error('Database connection failed:', err);
      throw err;
    }
  }
  return pool;
}

module.exports = { getConnection };