const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const path = require('path');

const login = async (req, res) => {
    const { email, password } = req.body;

    console.log('🔐 Tentativa de login:', email); // Para debug

    if (!email || !password) {
        return res.status(400).json({
            sucesso: false,
            mensagem: 'E-mail e senha são obrigatórios.'
        });
    }

    // Credenciais temporárias (ajuste conforme seu .env)
    if (email === process.env.AUTH_USER && password === process.env.AUTH_PASSWORD) {
        const token = jwt.sign(
            { email: email, nome: "Administrador" },
            process.env.JWT_SECRET || 'segredo-temporario-123',
            { expiresIn: '24h' }
        );

        console.log('✅ Login bem-sucedido');

        return res.json({
            sucesso: true,
            mensagem: 'Login bem-sucedido.',
            token: token
        });
    } else {
        return res.status(401).json({
            sucesso: false,
            mensagem: 'Email ou senha incorretos.'
        });
    }
};

const validarToken = (req, res) => {
    res.json({ sucesso: true, mensagem: 'Token válido.' });
};

module.exports = { login, validarToken };