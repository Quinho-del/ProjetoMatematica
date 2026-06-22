if (typeof document === 'undefined') {
  console.warn('Este arquivo é um script de navegador. Use-o em uma página HTML, não no Node.');
  return;
}

const loginForm = document.getElementById('loginForm');
const message = document.getElementById('message');

function showMessage(text, isError = true) {
  message.textContent = text;
  message.style.color = isError ? 'red' : 'green';
  
  setTimeout(() => {
    message.textContent = '';
    message.style.color = '';
  }, 4000);
}

async function handleLogin(event) {
  event.preventDefault();

  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();

  if (!email || !password) {
    showMessage('Preencha e-mail e senha.');
    return;
  }

  try {
    const response = await fetch('/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();   // Lê o JSON apenas uma vez

    if (!response.ok) {
      throw new Error(data.mensagem || data.message || 'Email ou senha incorretos');
    }

    // Login bem-sucedido
    if (data.token) {
      localStorage.setItem('jwtToken', data.token);
      showMessage('Login realizado com sucesso!', false);
      
      // Redirecionamento corrigido
      setTimeout(() => {
        window.location.href = '/Home';     // ou '/home' ou 'home.html'
      }, 800);
    } else {
      throw new Error('Token não recebido do servidor');
    }

  } catch (error) {
    console.error('Erro no login:', error);
    showMessage(error.message);
  }
}

// Inicialização
if (loginForm) {
  loginForm.addEventListener('submit', handleLogin);
} else {
  console.error('Elemento loginForm não encontrado!');
}