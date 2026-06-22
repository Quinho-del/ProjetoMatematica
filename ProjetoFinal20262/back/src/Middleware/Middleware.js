// =============================================
// MIDDLEWARE.JS - Todos os Middlewares em um arquivo
// Projeto: Química para Vestibular
// =============================================

// ====================== LOG MIDDLEWARE ======================
const logMiddleware = (req, res, next) => {
  console.log(`📌 [${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
};

// ====================== ERROR MIDDLEWARE ======================
const errorMiddleware = (erro, req, res, next) => {
  console.error('❌ Erro:', erro.message);

  res.status(500).json({
    sucesso: false,
    mensagem: 'Ocorreu um erro interno no servidor',
    erro: process.env.NODE_ENV === 'development' ? erro.message : undefined
  });
};

// ====================== AUTH MIDDLEWARE ======================
const authMiddleware = (req, res, next) => {
  // Por enquanto, vamos simular autenticação (você pode melhorar depois)
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({
      sucesso: false,
      mensagem: 'Acesso negado. Token não fornecido.'
    });
  }

  // Aqui você pode validar JWT no futuro
  // Por enquanto, só deixa passar
  next();
};

// ====================== EXPORTAÇÃO ======================
module.exports = {
  logMiddleware,
  errorMiddleware,
  authMiddleware
};