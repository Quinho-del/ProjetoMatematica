import { useEffect, useMemo, useState } from 'react'
import {
  extrairAlternativas,
  getComentario,
  getDificuldade,
  getDificuldadeLabel,
  getEnunciado,
  getId,
  getImagem,
  getLetraRespostaCorreta,
  getResposta,
  getTopico,
  getVestibular,
  limparEnunciado,
  ordenarQuestoes,
} from './Questoes.jsx'

function getAuthHeaders() {
  const token = localStorage.getItem('jwtToken')

  return token
    ? {
        Authorization: `Bearer ${token}`,
      }
    : {}
}

function formatarTempo(segundos) {
  const horas = Math.floor(segundos / 3600)
  const minutos = Math.floor((segundos % 3600) / 60)
  const segs = segundos % 60
  const partes = [minutos, segs].map((parte) => String(parte).padStart(2, '0'))

  return horas > 0 ? `${String(horas).padStart(2, '0')}:${partes.join(':')}` : partes.join(':')
}

function respostaCorretaLetra(questao) {
  return getLetraRespostaCorreta(getResposta(questao))
}

function Simulado({ onNavigate }) {
  const [questoes, setQuestoes] = useState([])
  const [respostas, setRespostas] = useState({})
  const [finalizado, setFinalizado] = useState(false)
  const [segundos, setSegundos] = useState(0)

  const totalRespondidas = useMemo(
    () => Object.values(respostas).filter(Boolean).length,
    [respostas],
  )

  const acertos = useMemo(() => {
    if (!finalizado) return 0

    return questoes.reduce((total, questao) => {
      const id = getId(questao)
      return respostas[id] === respostaCorretaLetra(questao) ? total + 1 : total
    }, 0)
  }, [finalizado, questoes, respostas])

  useEffect(() => {
    async function carregarSimulado() {
      try {
        const response = await fetch('/busca', {
          headers: getAuthHeaders(),
        })

        if (response.status === 401 || response.status === 403) {
          window.location.href = '/login'
          return
        }

        const data = await response.json()
        const sorted = Array.isArray(data) ? ordenarQuestoes(data).slice(0, 30) : []
        setQuestoes(sorted)
      } catch (error) {
        alert('Erro ao carregar o simulado.')
      }
    }

    carregarSimulado()
  }, [])

  useEffect(() => {
    if (finalizado) return undefined

    const timer = window.setInterval(() => {
      setSegundos((atual) => atual + 1)
    }, 1000)

    return () => window.clearInterval(timer)
  }, [finalizado])

  function selecionarResposta(idQuestao, letra) {
    if (finalizado) return
    setRespostas((atuais) => ({
      ...atuais,
      [idQuestao]: letra,
    }))
  }

  function finalizarSimulado() {
    setFinalizado(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function reiniciarSimulado() {
    setRespostas({})
    setFinalizado(false)
    setSegundos(0)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <>
      <main className="questoes-page simulado-page">
        <div className="container">
          <button className="page-back" type="button" onClick={() => onNavigate('/home')}>
            Voltar para Home
          </button>

          <section className="study-header simulado-header">
            <div>
              <span className="section-label">Simulado</span>
              <h1>30 questoes em uma unica rodada.</h1>
              <p>
                O cronometro fica ativo apenas para voce acompanhar seu tempo. As respostas e os
                comentarios aparecem quando o simulado for finalizado.
              </p>
            </div>

            <div className="study-stats" aria-label="Resumo do simulado">
              <div>
                <span>Tempo</span>
                <strong>{formatarTempo(segundos)}</strong>
              </div>
              <div>
                <span>Respondidas</span>
                <strong>
                  {totalRespondidas}/{questoes.length || 30}
                </strong>
              </div>
              <div>
                <span>Acertos</span>
                <strong>{finalizado ? `${acertos}/${questoes.length}` : '--'}</strong>
              </div>
            </div>
          </section>

          <div className="list-controls simulado-actions">
            <button
              className="btn btn-primary"
              type="button"
              disabled={questoes.length === 0 || finalizado}
              onClick={finalizarSimulado}
            >
              Finalizar simulado
            </button>
            <button className="btn btn-secondary" type="button" onClick={reiniciarSimulado}>
              Reiniciar
            </button>
          </div>

          <section className="simulado-list">
            {questoes.length === 0 ? (
              <div className="form-section">
                <p>Aguardando dados do servidor.</p>
              </div>
            ) : (
              questoes.map((questao, index) => {
                const id = getId(questao)
                const alternativas = extrairAlternativas(getEnunciado(questao))
                const imagem = getImagem(questao)
                const correta = respostaCorretaLetra(questao)
                const respostaUsuario = respostas[id]

                return (
                  <article className="form-section simulado-question" key={id}>
                    <div className="simulado-question-heading">
                      <h2>Questao {index + 1}</h2>
                      <div className="question-meta">
                        {getVestibular(questao) && <span>Vestibular: {getVestibular(questao)}</span>}
                        {getDificuldade(questao) && (
                          <span>Dificuldade: {getDificuldadeLabel(questao)}</span>
                        )}
                        {getTopico(questao) && <span>Topico: {getTopico(questao)}</span>}
                      </div>
                    </div>

                    {imagem && (
                      <figure className="question-image">
                        <img src={imagem} alt={`Imagem da questao ${index + 1}`} />
                      </figure>
                    )}

                    <div className="question-text">
                      {limparEnunciado(getEnunciado(questao))
                        .split('\n')
                        .filter(Boolean)
                        .map((linha, linhaIndex) => (
                          <p key={`${id}-${linhaIndex}`}>{linha}</p>
                        ))}
                    </div>

                    {alternativas.length > 0 ? (
                      <div className="options-list">
                        {alternativas.map((alternativa) => {
                          const estado =
                            finalizado && correta === alternativa.letra
                              ? ' correct'
                              : finalizado &&
                                  respostaUsuario === alternativa.letra &&
                                  correta !== alternativa.letra
                                ? ' incorrect'
                                : respostaUsuario === alternativa.letra
                                  ? ' selected'
                                  : ''

                          return (
                            <button
                              className={`btn btn-outline-primary option-btn${estado}`}
                              disabled={finalizado}
                              key={alternativa.letra}
                              type="button"
                              onClick={() => selecionarResposta(id, alternativa.letra)}
                            >
                              <strong>{alternativa.letra})</strong> {alternativa.texto}
                            </button>
                          )
                        })}
                      </div>
                    ) : (
                      <div className="comment-box simulado-comment">
                        <p>Alternativas nao cadastradas para esta questao.</p>
                      </div>
                    )}

                    {finalizado && (
                      <div className="comment-box simulado-comment">
                        <p>
                          <strong>Sua resposta:</strong> {respostaUsuario || 'Nao respondida'}
                        </p>
                        <p>
                          <strong>Resposta correta:</strong> {correta || 'Nao cadastrada'}
                        </p>
                        <p>
                          <strong>Comentario do especialista:</strong>
                          <br />
                          {getComentario(questao) || 'Sem comentario disponivel.'}
                        </p>
                      </div>
                    )}
                  </article>
                )
              })
            )}
          </section>
        </div>
      </main>

      <footer>
        <p>Copyright 2026 \ Vestibular +</p>
      </footer>
    </>
  )
}

export default Simulado
