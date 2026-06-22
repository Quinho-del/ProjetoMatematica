const express = require('express');
const router = express.Router();

const AuthController = require('../Controllers/authControllers');
const authMiddleware = require('../Middleware/authMiddleware');

router.post('/login', AuthController.login);
router.get('/validate', authMiddleware, AuthController.validarToken);

module.exports = router;