require('dotenv').config();

const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { logMiddleware, errorMiddleware } = require('./src/Middleware/Middleware');
const authRoutes = require('./src/Routes/authRoutes');
const authMiddleware = require('./src/Middleware/authMiddleware');

const app = express();
const PORT = process.env.PORT || 3000;

// ======================================================
// MIDDLEWARES
// ======================================================

app.use(cors());
app.use(express.json());
app.use(logMiddleware);

// ======================================================
// ROTAS
// ======================================================

const routes = require('./src/Routes/buscaRoutes');

app.use('/auth', authRoutes);
app.use('/busca', authMiddleware, routes);

// ======================================================
// PÁGINAS
// ======================================================

const frontDir = path.join(__dirname, '..', 'front');
const frontDistDir = path.join(frontDir, 'dist');
const frontIndexFile = path.join(frontDistDir, 'index.html');
const hasFrontendBuild = () => fs.existsSync(frontIndexFile);

const serveFrontend = (req, res) => {
    if (hasFrontendBuild()) {
        return res.sendFile(frontIndexFile);
    }

    return res.status(200).send(`
        <!doctype html>
        <html lang="pt-BR">
            <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1">
                <title>Vestibular+</title>
            </head>
            <body style="font-family: Arial, sans-serif; max-width: 720px; margin: 48px auto; line-height: 1.5;">
                <h1>Backend rodando</h1>
                <p>A API esta ativa em <strong>http://localhost:${PORT}</strong>.</p>
                <p>Para abrir o frontend em desenvolvimento, rode <code>npm run dev</code> na pasta <code>front</code> e acesse <strong>http://localhost:5173</strong>.</p>
                <p>Para servir o frontend pelo backend, rode <code>npm run build</code> na pasta <code>front</code> e depois reinicie o backend.</p>
            </body>
        </html>
    `);
};

app.get('/', serveFrontend);
app.get('/Home', serveFrontend);
app.get('/cadastro', serveFrontend);
app.get('/login', serveFrontend);
app.get('/api', (req, res) => {
    res.json({
        mensagem: 'API de Questões com PostgreSQL',
        versao: '3.0',
        ambiente: process.env.NODE_ENV || 'development',
        banco: 'PostgreSQL'
    });
});

// Serve os arquivos gerados pelo Vite quando existir build do frontend.
app.use(express.static(frontDistDir));
app.get(/.*/, serveFrontend);

// ======================================================
// MIDDLEWARE DE TRATAMENTO DE ERRO
// ======================================================

app.use(errorMiddleware);

// ======================================================
// SERVIDOR
// ======================================================

app.listen(PORT, () => {

    console.log('='.repeat(50));
    console.log('🚀 Servidor rodando!');
    console.log(`📍 URL: http://localhost:${PORT}`);
    console.log(`💾 Banco: PostgreSQL (${process.env.DB_NAME})`);
    console.log(`🌍 Ambiente: ${process.env.NODE_ENV || 'development'}`);
    console.log('='.repeat(50));

});
