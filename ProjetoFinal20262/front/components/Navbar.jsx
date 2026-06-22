function Navbar({ isAuthenticated, onLogout, onNavigate }) {
  function handleNavigate(event, path) {
    event.preventDefault()
    onNavigate(path)
  }

  return (
    <header className="navbar">
      <a className="logo" href="/home" onClick={(event) => handleNavigate(event, '/home')}>
        <span className="brand-text">Vestibular+</span>
      </a>

      <nav aria-label="Navegacao principal">
        <ul className="nav-links">
          <li>
            <a href="/home" onClick={(event) => handleNavigate(event, '/home')}>
              Home
            </a>
          </li>
          <li>
            <a href="/questoes" onClick={(event) => handleNavigate(event, '/questoes')}>
              Questoes
            </a>
          </li>
          <li>
            <a href="/simulado" onClick={(event) => handleNavigate(event, '/simulado')}>
              Simulado
            </a>
          </li>
          <li>
            <a href="/sobre" onClick={(event) => handleNavigate(event, '/sobre')}>
              Sobre
            </a>
          </li>
          {!isAuthenticated && (
            <li>
              <a href="/login" onClick={(event) => handleNavigate(event, '/login')}>
                Entrar
              </a>
            </li>
          )}
          {isAuthenticated && (
            <li>
              <button className="btn-logout" type="button" onClick={onLogout}>
                Sair
              </button>
            </li>
          )}
        </ul>
      </nav>
    </header>
  )
}

export default Navbar
