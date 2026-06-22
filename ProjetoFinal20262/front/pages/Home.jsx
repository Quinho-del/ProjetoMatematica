function Home() {
  return (
    <>
      <section className="subtitulo">
        <div className="hero-copy">
          <span className="hero-kicker">Vestibular+ / Matematica</span>
          <h1>
            Treine como se a prova ja tivesse comecado.
          </h1>
          <p>
            Questoes por tema, dificuldade e vestibular em uma experiencia feita
            para estudar rapido, revisar melhor e ganhar confianca.
          </p>
        </div>

        <div className="hero-panel" aria-label="Resumo da plataforma">
          <div>
            <span>Topicos</span>
            <strong>13</strong>
          </div>
          <div>
            <span>Busca</span>
            <strong>ID</strong>
          </div>
          <div>
            <span>Feedback</span>
            <strong>Direto</strong>
          </div>
        </div>
      </section>

      <main className="main">
        <section className="titulo-destaque">
          <span className="section-label">Questao em destaque</span>
          <h2>Combinatoria sem enrolacao</h2>
          <p className="questao-destaque">
            Uma escola vai montar equipes com 3 estudantes escolhidos entre 8
            finalistas de uma olimpiada interna. A ordem de escolha nao importa.
          </p>

          <div className="equacao">
            C(8, 3) = 8! / (3! . 5!)
          </div>

          <p className="question-prompt">
            Quantas equipes diferentes podem ser formadas?
          </p>

          <div className="alternativas-destaque">
            <button className="opcoes" type="button">(A) 24</button>
            <button className="opcoes" type="button">(B) 36</button>
            <button className="opcoes" type="button">(C) 56</button>
            <button className="opcoes" type="button">(D) 64</button>
            <button className="opcoes" type="button">(E) 336</button>
          </div>
        </section>

        <aside className="informacoes">
          <span className="section-label">Metodo</span>
          <h3>Estudo que cabe no intervalo</h3>
          <ul className="info-topicos">
            <li>Foco em raciocinio e resolucao</li>
            <li>Filtros por tema e dificuldade</li>
            <li>Comentarios para corrigir a rota</li>
          </ul>
        </aside>
      </main>

      <section className="contatos">
        <div>
          <span className="section-label">Contato</span>
          <h3>Fale com a gente</h3>
          <p>
            Duvidas sobre estudos ou sobre a plataforma? Nossa equipe esta pronta
            para ajudar.
          </p>
        </div>
        <div className="contatos-info">
          <div className="contatos-topicos">
            <span>E-mail</span>
            <p>suricateam@matematicavestibular.com</p>
          </div>
          <div className="contatos-topicos">
            <span>Telefone</span>
            <p>(11) 99999-9999</p>
          </div>
          <div className="contatos-topicos">
            <span>Atendimento</span>
            <p>Online / Brasil</p>
          </div>
        </div>
      </section>

      <footer>
        <p>Copyright 2026 Suricateam | Vestibular+</p>
      </footer>
    </>
  )
}

export default Home
