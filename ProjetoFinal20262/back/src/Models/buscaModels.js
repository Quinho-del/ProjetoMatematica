const pool = require('../Config/database');

const selectQuestoes = `
  SELECT
    q.idq AS id_questao,
    q.enunciado,
    q.referencias,
    q.nivel_de_dificuldade AS dificuldade,
    t.nome AS topico,
    t.descricao AS descricao_topico,
    v.nome AS vestibular,
    v.ano
  FROM questao q
  LEFT JOIN topico t ON t.idt = q.idtopico
  LEFT JOIN vestibular v ON v.idv = q.vestibular
`;

async function listarTodos() {
  const result = await pool.query(`
    ${selectQuestoes}
    ORDER BY ano DESC, id_questao
  `);

  return result.rows;
}

async function buscarPorId(id) {
  const result = await pool.query(`
    ${selectQuestoes}
    WHERE q.idq = $1
  `, [id]);

  return result.rows[0];
}

async function buscarPorPalavra(palavra) {
  const result = await pool.query(`
    ${selectQuestoes}
    WHERE
      q.enunciado ILIKE $1 OR
      q.referencias ILIKE $1 OR
      t.nome ILIKE $1 OR
      t.descricao ILIKE $1 OR
      v.nome ILIKE $1
  `, [`%${palavra}%`]);

  return result.rows;
}

async function buscarPorVestibular(vestibular) {
  const result = await pool.query(`
    ${selectQuestoes}
    WHERE v.nome ILIKE $1
    ORDER BY ano DESC, id_questao
  `, [`%${vestibular}%`]);

  return result.rows;
}

async function buscarPorAno(ano) {
  const result = await pool.query(`
    ${selectQuestoes}
    WHERE v.ano = $1
    ORDER BY id_questao
  `, [ano]);

  return result.rows;
}

async function buscarPorDificuldade(dificuldade) {
  const result = await pool.query(`
    ${selectQuestoes}
    WHERE q.nivel_de_dificuldade = $1
    ORDER BY ano DESC, id_questao
  `, [dificuldade]);

  return result.rows;
}

async function listarTopicos() {
  const result = await pool.query(`
    SELECT
      t.nome AS nome_t,
      COUNT(*) AS total
    FROM questao q
    LEFT JOIN topico t ON t.idt = q.idtopico
    GROUP BY t.nome
    ORDER BY COUNT(*) DESC, nome_t
  `);

  return result.rows;
}

async function buscarPorTopico(topico) {
  const result = await pool.query(`
    ${selectQuestoes}
    WHERE t.nome ILIKE $1
    ORDER BY ano DESC, id_questao
  `, [`%${topico}%`]);

  return result.rows;
}

async function buscarResposta(idQuestao) {
  const result = await pool.query(`
    SELECT
      r.idr,
      r.resposta_correta,
      r.explicacao
    FROM questao q
    INNER JOIN resposta r ON r.idr = q.idresposta
    WHERE q.idq = $1
  `, [idQuestao]);

  return result.rows[0];
}

module.exports = {
  listarTodos,
  buscarPorId,
  buscarPorPalavra,
  buscarPorVestibular,
  buscarPorAno,
  buscarPorDificuldade,
  listarTopicos,
  buscarPorTopico,
  buscarResposta,
};
