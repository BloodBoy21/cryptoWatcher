const express = require('express')
const router = express.Router()
const { cryptoController } = require('../controllers')
const { cacheMiddleware } = require('../middleware')
router.get(
  '/crypto/:name',
  cacheMiddleware.getCrypto,
  cryptoController.getCrypto
)
router.get('/top50', cacheMiddleware.getTop50, cryptoController.getTop50)
module.exports = router