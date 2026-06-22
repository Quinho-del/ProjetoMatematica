import { useState } from 'react'

function Cadastro({ onLogin, onNavigate }) {
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  function showMessage(text, success = false) {
    setMessage(text)
    setIsSuccess(success)
  }

  async function handleSubmit(event) {
    event.preventDefault()

    if (!nome.trim() || !email.trim() || !password.trim()) {
      showMessage('Preencha nome, e-mail e senha.')
      return
    }

    if (password !== confirmPassword) {
      showMessage('As senhas precisam ser iguais.')
      return
    }

    if (password.length < 6) {
      showMessage('A senha precisa ter pelo menos 6 caracteres.')
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch('/auth/cadastro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome: nome.trim(),
          email: email.trim(),
          password,
        }),
      })

      const data = await response.json()

      if (data.sucesso) {
        localStorage.setItem('jwtToken', data.token)
        onLogin()
        showMessage('Cadastro realizado com sucesso!', true)
        window.setTimeout(() => onNavigate('/home'), 800)
      } else {
        showMessage(data.mensagem || 'Nao foi possivel criar a conta.')
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
          <span>Nova conta</span>
          <h1>Comece com acesso seguro.</h1>
          <p>Cadastre-se para liberar as questoes e o simulado com autenticacao JWT.</p>
        </div>
      </section>

      <section className="login-container">
        <div className="login-heading">
          <span>Area do estudante</span>
          <h2>Cadastro</h2>
          <p className="subtitle">Crie sua conta no Vestibular+.</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="field-group">
            <label htmlFor="name">Nome</label>
            <input
              id="name"
              type="text"
              placeholder="Digite seu nome"
              required
              value={nome}
              onChange={(event) => setNome(event.target.value)}
            />
          </div>

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
              placeholder="Crie uma senha"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>

          <div className="field-group">
            <label htmlFor="confirm-password">Confirmar senha</label>
            <input
              id="confirm-password"
              type="password"
              placeholder="Digite a senha novamente"
              required
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
            />
          </div>

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Cadastrando...' : 'Cadastrar'}
          </button>
        </form>

        <button
          className="link-button"
          type="button"
          onClick={() => onNavigate('/login')}
        >
          Ja tenho uma conta
        </button>

        <div className={isSuccess ? 'message success' : 'message'}>{message}</div>
      </section>
    </main>
  )
}

export default Cadastro
