const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '..', '..', '.env') });
const { Pool } = require('pg');

const dbPassword = process.env.DB_PASSWORD ? String(process.env.DB_PASSWORD) : undefined;
const dbPort = Number.isNaN(Number(process.env.DB_PORT)) ? 5432 : parseInt(process.env.DB_PORT, 10);

if (!dbPassword) {
  console.error('❌ Erro: a variável DB_PASSWORD não está definida ou não é uma string.');
  console.error('💡 Verifique suas credenciais no arquivo .env e reinicie o servidor.');
}

// Configuração da Pool de conexão
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: dbPassword,
  port: dbPort,
});

// Teste de conexão
pool.connect((erro, client, release) => {
  if (erro) {
    console.error('❌ Erro ao conectar ao PostgreSQL:', erro.message);
    console.error('💡 Verifique suas credenciais no arquivo .env');
  } else {
    console.log('✅ Conectado ao PostgreSQL com sucesso!');
    console.log(`📊 Banco: ${process.env.DB_NAME}`);
    console.log(`🏠 Host: ${process.env.DB_HOST}:${process.env.DB_PORT}`);
    release();
  }
});

module.exports = pool;