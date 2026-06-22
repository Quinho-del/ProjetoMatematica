function Home() {
  return (
    <>
      <section className="subtitulo">
        <div className="hero-copy">
          <span className="hero-kicker">Vestibular+ / Estatistica</span>
          <h1>
            Treine como se a prova ja tivesse comecado.
          </h1>
          <p>
            Questoes de Estatistica por tema (Media, Moda e Mediana, Desvio Padrao e
            Analise de Grafico), dificuldade e vestibular em uma experiencia feita para estudar
            rapido, revisar melhor e ganhar confianca.
          </p>
        </div>

      </section>

      <main className="main home-main-single">
        <aside className="informacoes">
          <span className="section-label">Metodo</span>
          <h3>Questoes por topico</h3>
          <ul className="info-topicos">
            <li>Media, Moda e Mediana</li>
            <li>Desvio Padrao</li>
            <li>Analise de Grafico</li>
          </ul>
        </aside>
      </main>

      <footer>
        <p>Copyright 2026 \ Vestibular +</p>
      </footer>
    </>
  )
}

export default Home
