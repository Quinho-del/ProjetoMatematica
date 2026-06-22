import { useState } from 'react'

function Login({ onLogin, onNavigate }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  function showMessage(text, success = false) {
    setMessage(text)
    setIsSuccess(success)
  }

  async function handleSubmit(event) {
    event.preventDefault()

    if (!email.trim() || !password.trim()) {
      showMessage('Preencha e-mail e senha.')
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch('/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          password: password.trim(),
        }),
      })

      const data = await response.json()

      if (data.sucesso) {
        localStorage.setItem('jwtToken', data.token)
        onLogin()
        showMessage('Login realizado com sucesso!', true)
        window.setTimeout(() => onNavigate('/home'), 800)
      } else {
        showMessage(data.mensagem || 'E-mail ou senha incorretos.')
      }
    } catch (error) {
      showMessage('Erro ao conectar com o servidor.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="login-page">
      <section className="login-showcase" aria-hidden="true">
        <div className="login-wordmark">Vestibular+</div>
        <div className="login-showcase-copy">
          <span>Vestibular+</span>
          <h1>Matematica com ritmo de prova.</h1>
          <p>Entre, escolha uma questao e avance sem perder tempo.</p>
        </div>
        <div className="login-metrics">
          <div>
            <strong>13</strong>
            <span>topicos</span>
          </div>
          <div>
            <strong>3</strong>
            <span>filtros</span>
          </div>
          <div>
            <strong>2026</strong>
            <span>foco</span>
          </div>
        </div>
      </section>

      <section className="login-container">
        <div className="login-heading">
          <span>Area do estudante</span>
          <h2>Login</h2>
          <p className="subtitle">Acesse sua lista de questoes.</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="field-group">
            <label htmlFor="email">E-mail</label>
            <input
              id="email"
              type="email"
              placeholder="Digite seu e-mail"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>

          <div className="field-group">
            <label htmlFor="password">Senha</label>
            <input
              id="password"
              type="password"
              placeholder="Digite sua senha"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <div className={isSuccess ? 'message success' : 'message'}>{message}</div>
      </section>
    </main>
  )
}

export default Login
