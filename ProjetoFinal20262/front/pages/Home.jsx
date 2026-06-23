function Home() {
  return (
    <>
      <section className="subtitulo">
        <div className="hero-copy">
          <span className="hero-kicker">Vestibular+ / Estatística</span>
          <h1>
            Treine como se a prova já tivesse começado.
          </h1>
          <p>
            Questões por tema (Média, Moda e Mediana, Desvio Padrão e Análise de Gráfico),
            com busca por vestibular e por nível de dificuldade em uma experiência feita para
            estudar rápido, revisar melhor e ganhar confiança.
          </p>
        </div>

      </section>

      <main className="main home-main-single">
        <aside className="informacoes">
          <span className="section-label">Método</span>
          <h3>Questões por tópico</h3>
          <ul className="info-topicos">
            <li>Média, Moda e Mediana</li>
            <li>Desvio Padrão</li>
            <li>Análise de Gráfico</li>
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
