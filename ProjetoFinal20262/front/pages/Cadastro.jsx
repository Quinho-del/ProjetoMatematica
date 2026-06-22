import { useState } from 'react'

function Cadastro({ onNavigate }) {
  const [message, setMessage] = useState('')

  function handleSubmit(event) {
    event.preventDefault()
    setMessage('Cadastro demonstrativo. Nenhuma conta foi criada.')
  }

  return (
    <main className="login-page">
      <section className="login-container">
        <h1>Cadastro</h1>
        <p className="subtitle">Crie sua conta no Vestibular+</p>

        <form onSubmit={handleSubmit}>
          <label htmlFor="name">Nome</label>
          <input id="name" type="text" placeholder="Digite seu nome" required />

          <label htmlFor="email">E-mail</label>
          <input id="email" type="email" placeholder="Digite seu e-mail" required />

          <label htmlFor="password">Senha</label>
          <input id="password" type="password" placeholder="Crie uma senha" required />

          <label htmlFor="confirm-password">Confirmar senha</label>
          <input
            id="confirm-password"
            type="password"
            placeholder="Digite a senha novamente"
            required
          />

          <button type="submit">Cadastrar</button>
        </form>

        <button
          className="link-button"
          type="button"
          onClick={() => onNavigate('/login')}
        >
          Ja tenho uma conta
        </button>

        <div className="message success">{message}</div>
      </section>
    </main>
  )
}

export default Cadastro
