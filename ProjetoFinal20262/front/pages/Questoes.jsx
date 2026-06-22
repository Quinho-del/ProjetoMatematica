import { useEffect, useMemo, useState } from 'react'

function getId(questao) {
  return questao?.id_q || questao?.id_questao || questao?.id
}

function getTitulo(questao) {
  return questao?.nome_q || questao?.titulo || questao?.nome || ''
}

function getEnunciado(questao) {
  return questao?.enunciado_q || questao?.enunciado || ''
}

function getDificuldade(questao) {
  return questao?.dificuldade || questao?.nome_d || ''
}

function getTopico(questao) {
  return questao?.topico || questao?.palavra_chave || questao?.nome_t || ''
}

function normalizeTopico(text) {
  return String(text || '')
    .trim()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
}

function ordenarQuestoes(lista) {
  return [...lista].sort((a, b) => Number(getId(a)) - Number(getId(b)))
}

const TOPICOS_FIXOS = [
    'Algebra',
    'Funcoes',
    'Geometria plana',
    'Geometria espacial',
    'Trigonometria',
    'Estatistica',
    'Probabilidade',
    'Analise combinatoria',
    'Matematica financeira',
    'Porcentagem',
    'Razao e proporcao',
    'Sequencias',
    'Logaritmos',
]

function montarOpcoes(lista, campo) {
  const nomes = lista
    .map(campo)
    .filter(Boolean)
    .map((valor) => String(valor).trim())

  return [...new Set(nomes)].sort()
}

function extrairAlternativas(enunciado) {
  const texto = String(enunciado || '')
  const alternativas = []
  const regex = /(?:^|\n)\s*\(?([A-E])\)?[).]\s*([\s\S]*?)(?=(?:\n\s*\(?[A-E]\)?[).]\s*)|$)/gi
  let match

  while ((match = regex.exec(texto)) !== null) {
    alternativas.push({
      letra: match[1].toUpperCase(),
      texto: match[2].trim(),
    })
  }

  return alternativas
}

function limparEnunciado(enunciado) {
  return String(enunciado || '').split(/(?:^|\n)\s*\(?A\)?[).]\s*/i)[0]
}

function Questoes({ onNavigate }) {
  const [questoes, setQuestoes] = useState([])
  const [questaoAtual, setQuestaoAtual] = useState(null)
  const [indiceAtual, setIndiceAtual] = useState(0)
  const [topicos, setTopicos] = useState([])
  const [dificuldades, setDificuldades] = useState([])
  const [selectedTopico, setSelectedTopico] = useState('')
  const [selectedDificuldade, setSelectedDificuldade] = useState('')
  const [searchType, setSearchType] = useState('id')
  const [termoBusca, setTermoBusca] = useState('')
  const [alternativaSelecionada, setAlternativaSelecionada] = useState('')
  const [textoResposta, setTextoResposta] = useState('')
  const [resultado, setResultado] = useState(null)
  const [modalMessage, setModalMessage] = useState('')

  const alternativas = useMemo(
    () => extrairAlternativas(getEnunciado(questaoAtual)),
    [questaoAtual],
  )

  function getAuthHeaders() {
    const token = localStorage.getItem('jwtToken')

    return token
      ? {
          Authorization: `Bearer ${token}`,
        }
      : {}
  }

  function limparResposta() {
    setAlternativaSelecionada('')
    setTextoResposta('')
    setResultado(null)
  }

  function atualizarFiltros(lista) {
    const topicosBanco = montarOpcoes(lista, getTopico)
    setTopicos(topicosBanco.length > 0 ? topicosBanco : TOPICOS_FIXOS)
    setDificuldades(montarOpcoes(lista, getDificuldade))
  }

  async function carregarQuestoes() {
    try {
      const response = await fetch('/busca', {
        headers: getAuthHeaders(),
      })

      if (response.status === 401 || response.status === 403) {
        window.location.href = '/login'
        return
      }

      const data = await response.json()
      const sorted = Array.isArray(data) ? ordenarQuestoes(data) : []

      setQuestoes(sorted)
      atualizarFiltros(sorted)
      setIndiceAtual(0)
      setQuestaoAtual(sorted[0] || null)
      setSelectedTopico('')
      setSelectedDificuldade('')
      setSearchType('id')
      setTermoBusca('')
      limparResposta()
    } catch (error) {
      alert('Erro ao carregar as questões.')
    }
  }

  function selecionarQuestao(questao, indice = indiceAtual) {
    setQuestaoAtual(questao)
    setIndiceAtual(indice)
    limparResposta()
  }

  function buscarPorTopico(topico) {
    const normalizedTopico = normalizeTopico(topico)
    const filtradas = questoes.filter(
      (questao) => normalizeTopico(getTopico(questao)) === normalizedTopico,
    )

    if (filtradas.length === 0) {
      alert('Nenhuma questão encontrada para este tópico.')
      return
    }

    const sorted = ordenarQuestoes(filtradas)
    setQuestoes(sorted)
    setQuestaoAtual(sorted[0])
    setIndiceAtual(0)
    limparResposta()
  }

  async function buscarPorDificuldade(dificuldade) {
    try {
      const response = await fetch(`/busca/dificuldade/${encodeURIComponent(dificuldade)}`, {
        headers: getAuthHeaders(),
      })

      if (response.status === 401 || response.status === 403) {
        window.location.href = '/login'
        return
      }

      const data = await response.json()
      if (!Array.isArray(data) || data.length === 0) {
        alert('Nenhuma questão encontrada para esta dificuldade.')
        return
      }

      const sorted = ordenarQuestoes(data)
      setQuestoes(sorted)
      atualizarFiltros(sorted)
      setQuestaoAtual(sorted[0])
      setIndiceAtual(0)
      limparResposta()
    } catch (error) {
      alert('Erro ao buscar por dificuldade.')
    }
  }

  useEffect(() => {
    carregarQuestoes()
  }, [])

  async function buscarQuestao() {
    const termo = termoBusca.trim()

    if (!termo && !selectedTopico && !selectedDificuldade) {
      alert('Digite o termo de busca ou selecione um filtro.')
      return
    }

    if (selectedTopico) {
      buscarPorTopico(selectedTopico)
      return
    }

    if (selectedDificuldade) {
      await buscarPorDificuldade(selectedDificuldade)
      return
    }

    const termoLower = termo.toLowerCase()

    if (searchType === 'id') {
      const index = questoes.findIndex((questao) => String(getId(questao)) === termo)
      if (index >= 0) {
        selecionarQuestao(questoes[index], index)
        return
      }

      alert('Nenhuma questão encontrada para este ID.')
      return
    }

    if (searchType === 'ano') {
      const response = await fetch(`/busca/ano/${encodeURIComponent(termo)}`, {
        headers: getAuthHeaders(),
      })

      if (!response.ok) {
        alert('Nenhuma questão encontrada para este ano.')
        return
      }

      const data = await response.json()
      if (!Array.isArray(data) || data.length === 0) {
        alert('Nenhuma questão encontrada para este ano.')
        return
      }

      const sorted = ordenarQuestoes(data)
      setQuestoes(sorted)
      atualizarFiltros(sorted)
      setQuestaoAtual(sorted[0])
      setIndiceAtual(0)
      limparResposta()
      return
    }

    if (searchType === 'vestibular') {
      const response = await fetch(`/busca/vestibular/${encodeURIComponent(termo)}`, {
        headers: getAuthHeaders(),
      })

      if (!response.ok) {
        alert('Nenhuma questão encontrada para este vestibular.')
        return
      }

      const data = await response.json()
      if (!Array.isArray(data) || data.length === 0) {
        alert('Nenhuma questão encontrada para este vestibular.')
        return
      }

      const sorted = ordenarQuestoes(data)
      setQuestoes(sorted)
      atualizarFiltros(sorted)
      setQuestaoAtual(sorted[0])
      setIndiceAtual(0)
      limparResposta()
      return
    }

    const index = questoes.findIndex(
      (questao) =>
        String(getId(questao)) === termo ||
        getEnunciado(questao).toLowerCase().includes(termoLower) ||
        getTitulo(questao).toLowerCase().includes(termoLower),
    )

    if (index >= 0) {
      selecionarQuestao(questoes[index], index)
      return
    }

    alert('Nenhuma questão encontrada.')
  }

  function proximaQuestao() {
    if (questoes.length === 0) return

    const proximoIndice = (indiceAtual + 1) % questoes.length
    selecionarQuestao(questoes[proximoIndice], proximoIndice)
  }

  async function confirmarResposta() {
    if (!questaoAtual) return

    if (alternativas.length > 0 && !alternativaSelecionada) {
      alert('Por favor, selecione uma alternativa.')
      return
    }

    if (alternativas.length === 0 && !textoResposta.trim()) {
      alert('Escreva sua resposta antes de enviar.')
      return
    }

    try {
      const response = await fetch(`/busca/resposta/${getId(questaoAtual)}`, {
        headers: getAuthHeaders(),
      })

      if (response.status === 401 || response.status === 403) {
        window.location.href = '/login'
        return
      }

      if (!response.ok) {
        alert('Erro ao buscar a resposta correta.')
        return
      }

      const data = await response.json()
      if (!data) {
        alert('Resposta não encontrada para esta questão.')
        return
      }

      const respostaCorreta = String(data.resp_texto_r || '').trim()
      let correta = null
      let usuario = ''
      let resultadoTipo = 'unknown'

      if (alternativas.length > 0) {
        const match = respostaCorreta.match(/^\(?([A-E])\)?/i)
        correta = match ? match[1].toUpperCase() : respostaCorreta[0]?.toUpperCase()
        usuario = alternativaSelecionada
        resultadoTipo = correta === alternativaSelecionada ? 'correct' : 'incorrect'
      } else {
        usuario = textoResposta.trim()
        correta = respostaCorreta
        resultadoTipo =
          usuario.toLowerCase() === correta.toLowerCase() ? 'correct' : 'incorrect'
      }

      setResultado({
        correta,
        enviado: usuario,
        tipo: resultadoTipo,
        comentario: data.comentario_prof_r || 'Sem comentario disponivel.',
      })
    } catch (error) {
      alert('Erro ao buscar a resposta correta.')
    }
  }

  return (
    <>
      <main className="questoes-page">
        <div className="container">
          <button className="page-back" type="button" onClick={() => onNavigate('/home')}>
            Voltar para Home
          </button>

          <section className="study-header">
            <div>
              <span className="section-label">Banco de questoes</span>
              <h1>Escolha, responda, corrija.</h1>
              <p>
                Use os filtros para encontrar a questao certa e acompanhe o
                retorno do professor logo abaixo da resposta.
              </p>
            </div>

            <div className="study-stats" aria-label="Resumo das questoes">
              <div>
                <span>Lista</span>
                <strong>{questoes.length || '--'}</strong>
              </div>
              <div>
                <span>Atual</span>
                <strong>{questaoAtual ? getId(questaoAtual) : '--'}</strong>
              </div>
              <div>
                <span>Modo</span>
                <strong>{alternativas.length > 0 ? 'ABC' : 'Texto'}</strong>
              </div>
            </div>
          </section>

          <div className="list-controls">
            <button className="btn btn-success" type="button" onClick={carregarQuestoes}>
              Recarregar lista
            </button>

            <div className="search-box">
              <select
                aria-label="Buscar por"
                value={searchType}
                onChange={(event) => setSearchType(event.target.value)}
              >
                <option value="id">Buscar por ID</option>
                <option value="ano">Buscar por ano</option>
                <option value="vestibular">Buscar por vestibular</option>
              </select>

              <select
                aria-label="Topicos"
                value={selectedTopico}
                onChange={(event) => {
                  setSelectedTopico(event.target.value)
                  if (event.target.value) setSelectedDificuldade('')
                }}
              >
                <option value="">Todos os topicos</option>
                {topicos.map((topico) => (
                  <option key={topico} value={topico}>
                    {topico}
                  </option>
                ))}
              </select>

              <select
                aria-label="Dificuldade"
                value={selectedDificuldade}
                onChange={(event) => {
                  setSelectedDificuldade(event.target.value)
                  if (event.target.value) setSelectedTopico('')
                }}
              >
                <option value="">Todas as dificuldades</option>
                {dificuldades.map((dificuldade) => (
                  <option key={dificuldade} value={dificuldade}>
                    {dificuldade}
                  </option>
                ))}
              </select>

              <input
                type="text"
                placeholder={
                  selectedTopico || selectedDificuldade
                    ? 'Buscar dentro do filtro selecionado'
                    : searchType === 'ano'
                      ? 'Digite o ano (ex: 2021)'
                      : searchType === 'vestibular'
                        ? 'Digite o nome do vestibular (ex: ENEM)'
                        : 'Digite o ID da questao'
                }
                value={termoBusca}
                onChange={(event) => setTermoBusca(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') buscarQuestao()
                }}
              />

              <button className="btn btn-primary" type="button" onClick={buscarQuestao}>
                Buscar
              </button>
            </div>
          </div>

          <section className="form-section">
            <h2>
              {questaoAtual ? `Questao ${getId(questaoAtual)}` : 'Carregando questao...'}
              {getTitulo(questaoAtual) && <span> ({getTitulo(questaoAtual)})</span>}
            </h2>

            <div className="question-meta">
              {getDificuldade(questaoAtual) && (
                <span className="difficulty-label">
                  Dificuldade: {getDificuldade(questaoAtual)}
                </span>
              )}
            </div>

            <div className="question-text">
              {questaoAtual ? (
                limparEnunciado(getEnunciado(questaoAtual))
                  .split('\n')
                  .filter(Boolean)
                  .map((linha, index) => <p key={`${linha}-${index}`}>{linha}</p>)
              ) : (
                <p>Aguardando dados do servidor.</p>
              )}
            </div>

            {alternativas.length > 0 ? (
              <div className="options-list">
                {alternativas.map((alternativa) => {
                  const estado =
                    resultado?.correta === alternativa.letra
                      ? ' correct'
                      : resultado &&
                          alternativaSelecionada === alternativa.letra &&
                          resultado.correta !== alternativa.letra
                        ? ' incorrect'
                        : alternativaSelecionada === alternativa.letra
                          ? ' selected'
                          : ''

                  return (
                    <button
                      className={`btn btn-outline-primary option-btn${estado}`}
                      data-option={alternativa.letra}
                      disabled={Boolean(resultado)}
                      key={alternativa.letra}
                      type="button"
                      onClick={() => setAlternativaSelecionada(alternativa.letra)}
                    >
                      <strong>{alternativa.letra})</strong> {alternativa.texto}
                    </button>
                  )
                })}
              </div>
            ) : (
              <div className="text-answer-box">
                <label htmlFor="resposta-escrita" className="text-answer-label">
                  Resposta escrita
                </label>
                <textarea
                  id="resposta-escrita"
                  value={textoResposta}
                  onChange={(event) => setTextoResposta(event.target.value)}
                  placeholder="Escreva sua resposta aqui"
                  rows={6}
                />
              </div>
            )}

            <div className="form-buttons">
              <button className="btn btn-primary" type="button" onClick={confirmarResposta}>
                Confirmar resposta
              </button>
              <button className="btn btn-secondary" type="button" onClick={proximaQuestao}>
                Proxima questao
              </button>
            </div>
          </section>

          <section className="list-section">
            <h2>Comentario do professor</h2>
            <div className="comment-box">
              {resultado ? (
                <>
                  <p>
                    <strong>Sua resposta:</strong> {resultado.enviado}
                  </p>
                  {getId(questaoAtual) !== 2 && (
                    <p>
                      <strong>Resposta correta:</strong> {resultado.correta}
                    </p>
                  )}
                  <p>
                    <strong>Comentario do professor:</strong>
                    <br />
                    {resultado.comentario}
                  </p>
                </>
              ) : (
                <p>
                  <strong>Aguardando sua resposta...</strong>
                </p>
              )}
            </div>
          </section>
        </div>
      </main>

      <footer>
        <p>Copyright 2026 - Suricateam | Vestibular+</p>
      </footer>

      {modalMessage && (
        <div className="modal-message">
          <div className="modal-content">
            <p>{modalMessage}</p>
            <button className="btn btn-primary" type="button" onClick={() => setModalMessage('')}>
              Fechar
            </button>
          </div>
        </div>
      )}
    </>
  )
}

export default Questoes
