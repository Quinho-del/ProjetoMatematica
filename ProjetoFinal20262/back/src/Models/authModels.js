const pool = require('../Config/database');

let usuariosTablePromise;

function normalizarEmail(email) {
  return String(email || '').trim().toLowerCase();
}

function garantirTabelaUsuarios() {
  if (!usuariosTablePromise) {
    usuariosTablePromise = pool.query(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id SERIAL PRIMARY KEY,
        nome VARCHAR(120) NOT NULL,
        email VARCHAR(160) UNIQUE NOT NULL,
        senha_hash VARCHAR(255) NOT NULL,
        criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    usuariosTablePromise.catch(() => {
      usuariosTablePromise = undefined;
    });
  }

  return usuariosTablePromise;
}

async function buscarPorEmail(email) {
  await garantirTabelaUsuarios();

  const result = await pool.query(
    `
      SELECT id, nome, email, senha_hash
      FROM usuarios
      WHERE email = $1
      LIMIT 1
    `,
    [normalizarEmail(email)],
  );

  return result.rows[0];
}

async function criarUsuario({ nome, email, senhaHash }) {
  await garantirTabelaUsuarios();

  const result = await pool.query(
    `
      INSERT INTO usuarios (nome, email, senha_hash)
      VALUES ($1, $2, $3)
      RETURNING id, nome, email
    `,
    [String(nome).trim(), normalizarEmail(email), senhaHash],
  );

  return result.rows[0];
}

module.exports = {
  buscarPorEmail,
  criarUsuario,
  normalizarEmail,
};
