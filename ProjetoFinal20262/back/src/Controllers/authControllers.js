const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UsuarioModel = require('../Models/authModels');

const JWT_SECRET = process.env.JWT_SECRET || 'segredo-temporario-123';
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function gerarToken(usuario) {
    return jwt.sign(
        {
            id: usuario.id,
            nome: usuario.nome,
            email: usuario.email,
        },
        JWT_SECRET,
        { expiresIn: '24h' }
    );
}

function formatarUsuario(usuario) {
    return {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
    };
}

const cadastro = async (req, res) => {
    const { nome, email, password } = req.body;
    const nomeLimpo = String(nome || '').trim();
    const emailNormalizado = UsuarioModel.normalizarEmail(email);
    const senha = String(password || '');

    if (!nomeLimpo || !emailNormalizado || !senha) {
        return res.status(400).json({
            sucesso: false,
            mensagem: 'Nome, e-mail e senha sao obrigatorios.'
        });
    }

    if (!EMAIL_REGEX.test(emailNormalizado)) {
        return res.status(400).json({
            sucesso: false,
            mensagem: 'Informe um e-mail valido.'
        });
    }

    if (senha.length < 6) {
        return res.status(400).json({
            sucesso: false,
            mensagem: 'A senha precisa ter pelo menos 6 caracteres.'
        });
    }

    try {
        const usuarioExistente = await UsuarioModel.buscarPorEmail(emailNormalizado);

        if (usuarioExistente) {
            return res.status(409).json({
                sucesso: false,
                mensagem: 'Este e-mail ja esta cadastrado.'
            });
        }

        const senhaHash = await bcrypt.hash(senha, 10);
        const usuario = await UsuarioModel.criarUsuario({
            nome: nomeLimpo,
            email: emailNormalizado,
            senhaHash,
        });
        const token = gerarToken(usuario);

        return res.status(201).json({
            sucesso: true,
            mensagem: 'Cadastro realizado com sucesso.',
            token,
            usuario: formatarUsuario(usuario),
        });
    } catch (error) {
        if (error.code === '23505') {
            return res.status(409).json({
                sucesso: false,
                mensagem: 'Este e-mail ja esta cadastrado.'
            });
        }

        return res.status(500).json({
            sucesso: false,
            mensagem: 'Erro ao cadastrar usuario.'
        });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;
    const emailNormalizado = UsuarioModel.normalizarEmail(email);
    const senha = String(password || '');

    if (!emailNormalizado || !senha) {
        return res.status(400).json({
            sucesso: false,
            mensagem: 'E-mail e senha sao obrigatorios.'
        });
    }

    try {
        const usuario = await UsuarioModel.buscarPorEmail(emailNormalizado);

        if (!usuario) {
            return res.status(401).json({
                sucesso: false,
                mensagem: 'Email ou senha incorretos.'
            });
        }

        const senhaValida = await bcrypt.compare(senha, usuario.senha_hash);

        if (!senhaValida) {
            return res.status(401).json({
                sucesso: false,
                mensagem: 'Email ou senha incorretos.'
            });
        }

        const token = gerarToken(usuario);

        return res.json({
            sucesso: true,
            mensagem: 'Login bem-sucedido.',
            token,
            usuario: formatarUsuario(usuario),
        });
    } catch (error) {
        return res.status(500).json({
            sucesso: false,
            mensagem: 'Erro ao realizar login.'
        });
    }
};

const validarToken = (req, res) => {
    if (!req.user) {
        return res.status(401).json({
            sucesso: false,
            mensagem: 'Usuario nao autenticado.'
        });
    }

    res.json({
        sucesso: true,
        mensagem: 'Token valido.',
        usuario: req.user,
    });
};

module.exports = { cadastro, login, validarToken };
