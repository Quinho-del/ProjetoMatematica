import { useEffect, useMemo, useState } from 'react'

export function getId(questao) {
  return questao?.id_q || questao?.id_questao || questao?.id
}

export function getTitulo(questao) {
  return questao?.nome_q || questao?.titulo || questao?.nome || ''
}

export function getEnunciado(questao) {
  return questao?.enunciado_q || questao?.enunciado || ''
}

export function getDificuldade(questao) {
  return questao?.dificuldade || questao?.nome_d || ''
}

export function getDificuldadeLabel(questao) {
  const dificuldade = String(getDificuldade(questao) || '').trim()
  const labels = {
    1: '1 (fácil)',
    2: '2 (médio)',
    3: '3 (difícil)',
  }

  return labels[dificuldade] || dificuldade
}

export function getTopico(questao) {
  return questao?.topico || questao?.palavra_chave || questao?.nome_t || ''
}

export function getVestibular(questao) {
  const nome = questao?.vestibular || questao?.nome_v || ''
  const ano = questao?.ano ? ` ${questao.ano}` : ''
  return `${nome}${ano}`.trim()
}

export function getImagem(questao) {
  const imagem = String(questao?.imagem || questao?.caminho || questao?.img || '')
    .replace(/\s+/g, '')
    .trim()

  if (!imagem) return ''
  if (/^(https?:|data:image\/|\/)/i.test(imagem)) return imagem
  return `/${imagem.replace(/^\.?\//, '')}`
}

export function getComentario(questao) {
  return questao?.comentario_prof_r || questao?.explicacao || questao?.comentario || ''
}

export function getResposta(questao) {
  return questao?.resp_texto_r || questao?.resposta_correta || questao?.resposta || ''
}

export function getLetraRespostaCorreta(resposta) {
  const texto = String(resposta || '').trim()
  const match = texto.match(/(?:^|[^A-Za-zÀ-ÿ])\(?([A-E])\)?(?:$|[^A-Za-zÀ-ÿ])/i)

  return match ? match[1].toUpperCase() : texto[0]?.toUpperCase()
}

export function normalizeText(text) {
  return String(text || '')
    .trim()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
}

export function ordenarQuestoes(lista) {
  return [...lista].sort((a, b) => Number(getId(a)) - Number(getId(b)))
}

export function montarOpcoes(lista, campo) {
  const nomes = lista
    .map(campo)
    .filter(Boolean)
    .map((valor) => String(valor).trim())

  return [...new Set(nomes)].sort()
}

export function montarOpcoesUnicas(lista, campo) {
  const opcoesPorNome = new Map()

  lista
    .map(campo)
    .filter(Boolean)
    .map((valor) => String(valor).trim())
    .forEach((valor) => {
      opcoesPorNome.set(normalizeText(valor), valor)
    })

  return [...opcoesPorNome.values()].sort()
}

export function normalizarMarcadoresAlternativas(enunciado) {
  return String(enunciado || '')
    .replace(
      /(^|[\s;])\(?([A-E])\)?\s*[).:-]\s*/gi,
      (_, prefixo, letra) => `${prefixo.trim() ? prefixo : ''}\n${letra.toUpperCase()}) `,
    )
    .replace(
      /(^|[\n;])\s*\(?([A-E])\)?\s+/gi,
      (_, prefixo, letra) => `${prefixo.trim() ? prefixo : ''}\n${letra.toUpperCase()}) `,
    )
}

function encontrarInicioAlternativas(texto) {
  const marcadores = [...texto.matchAll(/(?:^|\n)\s*([A-E])\)\s*/g)].map((match) => ({
    letra: match[1],
    index: match.index,
  }))

  for (let index = marcadores.length - 5; index >= 0; index -= 1) {
    const sequencia = marcadores.slice(index, index + 5).map((marcador) => marcador.letra).join('')

    if (sequencia === 'ABCDE') {
      return marcadores[index].index
    }
  }

  for (let index = marcadores.length - 4; index >= 0; index -= 1) {
    const sequencia = marcadores.slice(index, index + 4).map((marcador) => marcador.letra).join('')

    if (sequencia === 'ABCD') {
      return marcadores[index].index
    }
  }

  return marcadores[0]?.index ?? -1
}

function extrairAlternativasSemLetras(texto) {
  const linhas = texto
    .split('\n')
    .map((linha) => linha.trim())
    .filter(Boolean)
  const ultimasLinhas = linhas.slice(-5)
  const parecemAlternativas = ultimasLinhas.length >= 4 && ultimasLinhas.every((linha) => {
    if (linha.length > 80) return false
    return /^[\dIVX]+(?:[,.\/]\d+)?%?\.?$/i.test(linha) || /^[\dIVX]+\/[\dIVX]+\.?$/i.test(linha)
  })

  if (!parecemAlternativas) return []

  return ultimasLinhas.map((linha, index) => ({
    letra: String.fromCharCode(65 + index),
    texto: linha.replace(/\.$/, ''),
  }))
}

export function extrairAlternativas(enunciado) {
  const texto = normalizarMarcadoresAlternativas(enunciado)
  const inicioAlternativas = encontrarInicioAlternativas(texto)
  if (inicioAlternativas < 0) return extrairAlternativasSemLetras(texto)

  const blocoAlternativas = texto.slice(inicioAlternativas)
  const alternativas = []
  const regex = /(?:^|\n)\s*([A-E])\)\s*([\s\S]*?)(?=(?:\n\s*[A-E]\)\s*)|$)/gi
  let match

  while ((match = regex.exec(blocoAlternativas)) !== null) {
    alternativas.push({
      letra: match[1].toUpperCase(),
      texto: match[2].trim(),
    })
  }

  return alternativas
}

export function limparEnunciado(enunciado) {
  const texto = normalizarMarcadoresAlternativas(enunciado)
  const inicioAlternativas = encontrarInicioAlternativas(texto)
  const alternativasSemLetras = inicioAlternativas < 0 ? extrairAlternativasSemLetras(texto) : []

  if (alternativasSemLetras.length > 0) {
    const linhas = texto.split('\n')
    return linhas.slice(0, -alternativasSemLetras.length).join('\n').trim()
  }

  return (inicioAlternativas >= 0 ? texto.slice(0, inicioAlternativas) : texto).trim()
}

const TOPICOS_FIXOS = ['Média, Moda e Mediana', 'Desvio Padrão', 'Análise de Gráfico']

function getAuthHeaders() {
  const token = localStorage.getItem('jwtToken')

  return token
    ? {
        Authorization: `Bearer ${token}`,
      }
    : {}
}

function renderQuestionImage(questao) {
  const imagem = getImagem(questao)
  if (!imagem) return null

  return (
    <figure className="question-image">
      <img src={imagem} alt={`Imagem da questao ${getId(questao)}`} />
    </figure>
  )
}

function Questoes({ onNavigate }) {
  const [todasQuestoes, setTodasQuestoes] = useState([])
  const [questoes, setQuestoes] = useState([])
  const [questaoAtual, setQuestaoAtual] = useState(null)
  const [indiceAtual, setIndiceAtual] = useState(0)
  const [topicos, setTopicos] = useState([])
  const [dificuldades, setDificuldades] = useState([])
  const [vestibulares, setVestibulares] = useState([])
  const [selectedTopico, setSelectedTopico] = useState('')
  const [selectedDificuldade, setSelectedDificuldade] = useState('')
  const [selectedVestibular, setSelectedVestibular] = useState('')
  const [termoBusca, setTermoBusca] = useState('')
  const [alternativaSelecionada, setAlternativaSelecionada] = useState('')
  const [resultado, setResultado] = useState(null)

  const alternativas = useMemo(
    () => extrairAlternativas(getEnunciado(questaoAtual)),
    [questaoAtual],
  )

  function limparResposta() {
    setAlternativaSelecionada('')
    setResultado(null)
  }

  function atualizarFiltros(lista) {
    const topicosBanco = montarOpcoes(lista, getTopico)
    setTopicos(montarOpcoesUnicas([...topicosBanco, ...TOPICOS_FIXOS], (topico) => topico))
    setDificuldades(montarOpcoes(lista, getDificuldade))
    setVestibulares(montarOpcoes(lista, (questao) => questao?.vestibular || ''))
  }

  function selecionarPrimeira(lista) {
    setQuestoes(lista)
    setQuestaoAtual(lista[0] || null)
    setIndiceAtual(0)
    limparResposta()
  }

  function aplicarFiltros({
    listaBase = todasQuestoes,
    topico = selectedTopico,
    dificuldade = selectedDificuldade,
    vestibular = selectedVestibular,
    termo = termoBusca,
    mostrarAlerta = true,
  } = {}) {
    const termoNormalizado = normalizeText(termo)
    const filtradas = listaBase.filter((questao) => {
      const combinaTopico = !topico || normalizeText(getTopico(questao)) === normalizeText(topico)
      const combinaDificuldade =
        !dificuldade || normalizeText(getDificuldade(questao)) === normalizeText(dificuldade)
      const combinaVestibular =
        !vestibular ||
        normalizeText(questao?.vestibular || '') === normalizeText(vestibular)
      const combinaTermo =
        !termoNormalizado ||
        String(getId(questao)) === termoNormalizado ||
        normalizeText(getEnunciado(questao)).includes(termoNormalizado) ||
        normalizeText(getTitulo(questao)).includes(termoNormalizado) ||
        normalizeText(getTopico(questao)).includes(termoNormalizado) ||
        normalizeText(getVestibular(questao)).includes(termoNormalizado) ||
        normalizeText(getDificuldade(questao)).includes(termoNormalizado) ||
        normalizeText(getDificuldadeLabel(questao)).includes(termoNormalizado)

      return combinaTopico && combinaDificuldade && combinaVestibular && combinaTermo
    })

    const sorted = ordenarQuestoes(filtradas)
    selecionarPrimeira(sorted)

    if (mostrarAlerta && sorted.length === 0) {
      alert('Nenhuma questao encontrada com estes filtros.')
    }
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

      setTodasQuestoes(sorted)
      atualizarFiltros(sorted)
      setSelectedTopico('')
      setSelectedDificuldade('')
      setSelectedVestibular('')
      setTermoBusca('')
      selecionarPrimeira(sorted)
    } catch (error) {
      alert('Erro ao carregar as questoes.')
    }
  }

  function selecionarQuestao(questao, indice = indiceAtual) {
    setQuestaoAtual(questao)
    setIndiceAtual(indice)
    limparResposta()
  }

  useEffect(() => {
    carregarQuestoes()
  }, [])

  function buscarQuestao() {
    aplicarFiltros()
  }

  function limparFiltros() {
    setSelectedTopico('')
    setSelectedDificuldade('')
    setSelectedVestibular('')
    setTermoBusca('')
    aplicarFiltros({
      topico: '',
      dificuldade: '',
      vestibular: '',
      termo: '',
      mostrarAlerta: false,
    })
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
      const respostaCorreta = String(getResposta(data) || '').trim()
      let correta = null
      let usuario = ''
      let resultadoTipo = 'unknown'

      if (alternativas.length > 0) {
        correta = getLetraRespostaCorreta(respostaCorreta)
        usuario = alternativaSelecionada
        resultadoTipo = correta === alternativaSelecionada ? 'correct' : 'incorrect'
      } else {
        correta = respostaCorreta
      }

      setResultado({
        correta,
        enviado: usuario,
        tipo: resultadoTipo,
        comentario: getComentario(data) || 'Sem comentário disponível.',
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
              <span className="section-label">Banco de questões</span>
              <h1>Escolha, responda, corrija.</h1>
              <p>
                Use os filtros por tópico, vestibular e dificuldade para encontrar a questão
                certa. Depois confira o comentário do especialista.
              </p>
            </div>

            <div className="study-stats" aria-label="Resumo das questoes">
              <div>
                <span>Filtradas</span>
                <strong>{questoes.length || '--'}</strong>
              </div>
              <div>
                <span>Total</span>
                <strong>{todasQuestoes.length || '--'}</strong>
              </div>
              <div>
                <span>Atual</span>
                <strong>{questaoAtual ? getId(questaoAtual) : '--'}</strong>
              </div>
            </div>
          </section>

          <div className="list-controls">
            <button className="btn btn-success" type="button" onClick={carregarQuestoes}>
              Recarregar lista
            </button>
            <button className="btn btn-secondary" type="button" onClick={limparFiltros}>
              Limpar filtros
            </button>

            <div className="search-box">
              <select
                aria-label="Topicos"
                value={selectedTopico}
                onChange={(event) => setSelectedTopico(event.target.value)}
              >
                <option value="">Todos os topicos</option>
                {topicos.map((topico) => (
                  <option key={topico} value={topico}>
                    {topico}
                  </option>
                ))}
              </select>

              <select
                aria-label="Vestibular"
                value={selectedVestibular}
                onChange={(event) => setSelectedVestibular(event.target.value)}
              >
                <option value="">Todos os vestibulares</option>
                {vestibulares.map((vestibular) => (
                  <option key={vestibular} value={vestibular}>
                    {vestibular}
                  </option>
                ))}
              </select>

              <select
                aria-label="Dificuldade"
                value={selectedDificuldade}
                onChange={(event) => setSelectedDificuldade(event.target.value)}
              >
                <option value="">Todas as dificuldades</option>
                {dificuldades.map((dificuldade) => (
                  <option key={dificuldade} value={dificuldade}>
                    {getDificuldadeLabel({ dificuldade })}
                  </option>
                ))}
              </select>

              <input
                type="text"
                placeholder="Buscar por tópico, vestibular e por nível de dificuldade..."
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
              {questaoAtual ? `Questão ${getId(questaoAtual)}` : 'Carregando questão...'}
              {getTitulo(questaoAtual) && <span> ({getTitulo(questaoAtual)})</span>}
            </h2>

            <div className="question-meta">
              {getVestibular(questaoAtual) && <span>Vestibular: {getVestibular(questaoAtual)}</span>}
              {getDificuldade(questaoAtual) && (
                <span>Dificuldade: {getDificuldadeLabel(questaoAtual)}</span>
              )}
              {getTopico(questaoAtual) && <span>Tópico: {getTopico(questaoAtual)}</span>}
            </div>

            {renderQuestionImage(questaoAtual)}

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
            ) : null}

            <div className="form-buttons">
              <button className="btn btn-primary" type="button" onClick={confirmarResposta}>
                Confirmar resposta
              </button>
              <button className="btn btn-secondary" type="button" onClick={proximaQuestao}>
                Próxima questão
              </button>
            </div>
          </section>

          <section className="list-section">
            <h2>Comentário do especialista</h2>
            <div className="comment-box">
              {resultado ? (
                <>
                  {resultado.enviado && (
                    <p>
                      <strong>Sua resposta:</strong> {resultado.enviado}
                    </p>
                  )}
                  <p>
                    <strong>Resposta correta:</strong> {resultado.correta}
                  </p>
                  <p>
                    <strong>Comentário do especialista:</strong>
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
        <p>Copyright 2026 \ Vestibular +</p>
      </footer>
    </>
  )
}

export default Questoes
