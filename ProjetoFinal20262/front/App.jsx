import { useEffect, useState } from 'react'
import './App.css'
import Navbar from './components/Navbar.jsx'
import Cadastro from './pages/Cadastro.jsx'
import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'
import Questoes from './pages/Questoes.jsx'
import Simulado from './pages/Simulado.jsx'
import Sobre from './pages/Sobre.jsx'


const routes = {
  '/': Login,
  '/home': Home,
  '/Home': Home,
  '/cadastro': Cadastro,
  '/login': Login,
  '/questoes': Questoes,
  '/simulado': Simulado,
  '/sobre': Sobre,
}

function getCurrentPath() {
  return window.location.pathname.replace(/\/$/, '') || '/'
}

function App() {
  const [path, setPath] = useState(getCurrentPath)
  const [isAuthenticated, setIsAuthenticated] = useState(() =>
    Boolean(localStorage.getItem('jwtToken')),
  )
  const protectedPaths = ['/questoes', '/simulado']

  useEffect(() => {
    const handlePopState = () => setPath(getCurrentPath())
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  useEffect(() => {
    async function validarLogin() {
      const token = localStorage.getItem('jwtToken')

      if (!token) {
        setIsAuthenticated(false)
        return
      }

      try {
        const response = await fetch('/auth/validate', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          localStorage.removeItem('jwtToken')
          setIsAuthenticated(false)

          if (protectedPaths.includes(getCurrentPath().toLowerCase())) {
            window.history.replaceState({}, '', '/login')
            setPath('/login')
          }
          return
        }

        setIsAuthenticated(true)
      } catch (error) {
        localStorage.removeItem('jwtToken')
        setIsAuthenticated(false)
      }
    }

    validarLogin()
  }, [])

  function navigate(nextPath) {
    const normalizedPath = nextPath.toLowerCase()
    const token = localStorage.getItem('jwtToken')

    if ((!isAuthenticated || !token) && protectedPaths.includes(normalizedPath)) {
      window.history.pushState({}, '', '/login')
      setPath('/login')
      return
    }

    window.history.pushState({}, '', nextPath)
    setPath(getCurrentPath())
  }

  function handleLogout() {
    localStorage.removeItem('jwtToken')
    setIsAuthenticated(false)
    navigate('/login')
  }

  const effectivePath =
    !isAuthenticated && protectedPaths.includes(path.toLowerCase())
      ? '/login'
      : path
  const Page = routes[effectivePath] || Login
  const isLoginPage = ['/', '/login', '/cadastro'].includes(effectivePath.toLowerCase())

  return (
    <div className="app-shell">
      {!isLoginPage && (
        <Navbar
          isAuthenticated={isAuthenticated}
          onNavigate={navigate}
          onLogout={handleLogout}
        />
      )}
      <Page
        isAuthenticated={isAuthenticated}
        onLogin={() => setIsAuthenticated(true)}
        onNavigate={navigate}
      />
    </div>
  )
}

export default App
