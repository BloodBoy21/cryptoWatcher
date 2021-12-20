const express = require('express')
const router = express.Router()
const { cryptoController } = require('../controllers')
const { cacheMiddleware } = require('../middleware')
router.get('/crypto', cacheMiddleware.getCrypto)
router.get(
  '/crypto/:name',
  cacheMiddleware.getCrypto,
  cryptoController.getCrypto
)
router.get('/top50', cacheMiddleware.getTop50, cryptoController.getTop50)
router.get('/coins', cryptoController.getCoins)
module.exports = router
