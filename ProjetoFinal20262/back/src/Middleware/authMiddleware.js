const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
        return res.status(401).json({
            sucesso: false,
            mensagem: 'Token não fornecido.'
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'segredo-temporario-123');
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(403).json({
            sucesso: false,
            mensagem: 'Token inválido ou expirado.'
        });
    }
};

module.exports = authMiddleware;
