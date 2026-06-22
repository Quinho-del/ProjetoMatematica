const BuscaModel = require('../Models/buscaModels');

function mapRow(row) {
  if (!row) return row

  const mapped = { ...row }

  // common aliases expected by the front
  mapped.id_q = row.id_q || row.id_questao || row.id_q
  mapped.nome_q = row.nome_q || row.titulo || row.nome_q || row.nome || ''
  mapped.enunciado_q = row.enunciado_q || row.enunciado || ''
  mapped.palavra_chave_q = row.palavra_chave_q || row.palavra_chave || ''
  mapped.topico = row.topico || row.nome_t || row.palavra_chave || ''
  mapped.nome_t = row.nome_t || mapped.topico
  mapped.nome_d = row.nome_d || row.dificuldade || ''
  mapped.dificuldade = row.dificuldade || mapped.nome_d
  mapped.ano = row.ano || row.data || row.data_q
  mapped.caminho = row.caminho || row.imagem || row.img || ''
  mapped.resp_texto_r = row.resp_texto_r || row.resposta_correta || row.resposta || ''
  mapped.comentario_prof_r = row.comentario_prof_r || row.explicacao || row.comentario || ''

  return mapped
}

// Listar todas
async function listarTodos(req, res) {
  try {
    const dados = await BuscaModel.listarTodos();
    const mapped = Array.isArray(dados) ? dados.map(mapRow) : dados
    res.status(200).json(mapped);
  } catch (erro) {
    res.status(500).json({
      erro: erro.message
    });
  }
}

// Buscar por ID
async function buscarPorId(req, res) {
  try {
    const { id } = req.params;

    const dados = await BuscaModel.buscarPorId(id);

    if (!dados) {
      return res.status(404).json({
        mensagem: 'Questão não encontrada'
      });
    }

    res.status(200).json(mapRow(dados));
  } catch (erro) {
    res.status(500).json({
      erro: erro.message
    });
  }
}

// Buscar por palavra
async function buscarPorPalavra(req, res) {
  try {
    const { palavra } = req.params;

    const dados =
      await BuscaModel.buscarPorPalavra(palavra);

    res.status(200).json(Array.isArray(dados) ? dados.map(mapRow) : dados);
  } catch (erro) {
    res.status(500).json({
      erro: erro.message
    });
  }
}

// Buscar vestibular
async function buscarPorVestibular(req, res) {
  try {
    const { vestibular } = req.params;

    const dados =
      await BuscaModel.buscarPorVestibular(
        vestibular
      );

    res.status(200).json(Array.isArray(dados) ? dados.map(mapRow) : dados);
  } catch (erro) {
    res.status(500).json({
      erro: erro.message
    });
  }
}

// Buscar ano
async function buscarPorAno(req, res) {
  try {
    const { ano } = req.params;

    const dados =
      await BuscaModel.buscarPorAno(ano);

    res.status(200).json(Array.isArray(dados) ? dados.map(mapRow) : dados);
  } catch (erro) {
    res.status(500).json({
      erro: erro.message
    });
  }
}

// Buscar dificuldade
async function buscarPorDificuldade(req, res) {
  try {
    const { dificuldade } = req.params;

    const dados =
      await BuscaModel.buscarPorDificuldade(
        dificuldade
      );

    res.status(200).json(Array.isArray(dados) ? dados.map(mapRow) : dados);
  } catch (erro) {
    res.status(500).json({
      erro: erro.message
    });
  }
}

// Listar tópicos
async function listarTopicos(req, res) {
  try {
    const dados = await BuscaModel.listarTopicos();
    res.status(200).json(Array.isArray(dados) ? dados.map(mapRow) : dados);
  } catch (erro) {
    res.status(500).json({
      erro: erro.message,
    });
  }
}

// Buscar por tópico
async function buscarPorTopico(req, res) {
  try {
    const { topico } = req.params;

    const dados = await BuscaModel.buscarPorTopico(topico);

    if (!Array.isArray(dados) || dados.length === 0) {
      return res.status(404).json({
        mensagem: 'Nenhuma questão encontrada para este tópico.',
      });
    }

    res.status(200).json(dados.map(mapRow));
  } catch (erro) {
    res.status(500).json({
      erro: erro.message,
    });
  }
}

// Buscar resposta
async function buscarResposta(req, res) {
  try {
    const { id } = req.params;

    const dados =
      await BuscaModel.buscarResposta(id);

    res.status(200).json(mapRow(dados));
  } catch (erro) {
    res.status(500).json({
      erro: erro.message
    });
  }
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
