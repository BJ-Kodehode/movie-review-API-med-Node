const sql = require('mssql');
const dotenv = require('dotenv');

dotenv.config();

let poolPromise;

function createConfig() {
  const encrypt = String(process.env.DB_ENCRYPT || 'true').toLowerCase() === 'true';
  const trustServerCertificate = String(process.env.DB_TRUST_SERVER_CERTIFICATE || 'true').toLowerCase() === 'true';
  const port = Number(process.env.DB_PORT || 1433);
  return {
    server: process.env.DB_SERVER,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    options: {
      encrypt,
      trustServerCertificate
    },
    port
  };
}

async function getPool() {
  if (!poolPromise) {
    poolPromise = sql.connect(createConfig());
  }
  return poolPromise;
}

module.exports = { getPool };

