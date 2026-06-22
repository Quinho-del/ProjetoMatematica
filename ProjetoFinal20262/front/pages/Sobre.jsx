import Card from '../components/Card'

function Sobre({ onNavigate }) {
  const alunos = [
    { nome: 'Marcos Quiozini', foto: './img/Beatriz Foto.jpeg' },
    { nome: 'Leide Francisca', foto: './img/Lucas Foto.jpg' },
    { nome: 'Pablo Neres', foto: './img/Mateus Foto.jpg' },
    { nome: 'Giovanna Pires', foto: './img/Nicolas Foto.jpg' },
    { nome: 'Alexandre Riqeulme', foto: './img/Otavio Foto.jpg' },
  ]

  const professores = [
    { nome: 'Professora SESI', foto: './img/Flavienne Sesi.jpeg' },
  ]

  return (
    <>
      <main className="about-page">
        <button className="page-back" type="button" onClick={() => onNavigate('/home')}>
          Voltar para Home
        </button>

        <section className="about-hero">
          <span className="section-label">Suricateam</span>
          <h1>Quem construiu o Vestibular+</h1>
          <p>
            Um projeto pensado para deixar a rotina de estudo mais objetiva,
            bonita e facil de navegar.
          </p>
        </section>

        <section className="people-section">
          <div className="section-heading">
            <span className="section-label">Equipe</span>
            <h2>Criadores</h2>
          </div>
          <div className="people-grid">
            {alunos.map((pessoa) => (
              <Card key={pessoa.nome} nome={pessoa.nome} foto={pessoa.foto} />
            ))}
          </div>
        </section>

        <section className="people-section">
          <div className="section-heading">
            <span className="section-label">Orientacao</span>
            <h2>Professora</h2>
          </div>
          <div className="people-grid people-grid-centered">
            {professores.map((pessoa, index) => (
              <Card key={`prof-${index}`} nome={pessoa.nome} foto={pessoa.foto} />
            ))}
          </div>
        </section>
      </main>

      <footer>
        <p>Copyright 2026 \ Vestibular +</p>
      </footer>
    </>
  )
}

export default Sobre
