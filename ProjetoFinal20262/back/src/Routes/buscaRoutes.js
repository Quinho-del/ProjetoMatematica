const express = require('express');
const router = express.Router();

const BuscaController =
  require('../Controllers/buscaControllers');
const authMiddleware = require('../Middleware/authMiddleware');

router.use(authMiddleware);

router.get('/', BuscaController.listarTodos);

router.get('/id/:id',BuscaController.buscarPorId);

router.get('/palavra/:palavra',BuscaController.buscarPorPalavra);

router.get('/vestibular/:vestibular',BuscaController.buscarPorVestibular);

router.get('/ano/:ano', BuscaController.buscarPorAno);

router.get('/dificuldade/:dificuldade', BuscaController.buscarPorDificuldade);

router.get('/topicos-lista', BuscaController.listarTopicos);

router.get('/topicos/:topico', BuscaController.buscarPorTopico);

router.get('/resposta/:id', BuscaController.buscarResposta);

module.exports = router;
