const cache = require('../cache')
const oneHourToExpire = 1000 * 60 * 60 // 1 hour
const oneDayToExpire = 1000 * 60 * 60 * 24 // 1 day
const { cryptoUtil, responseError } = require('../utils')
const getTimeout = (timestamp) => {
  return Date.now() - new Date(timestamp)
}
exports.getCrypto = async (req, res, next) => {
  try {
    let cryptoGetByData = false
    let cryptoSelect = null
    if (!req.params.name) {
      throw responseError.BadRequestError('Name is required')
    }
    req.params.name = req.params.name.toLowerCase()
    if (req.query.force === 'true') return next() // if force is true then go to next middleware
    if (req.query.date) {
      // if date is provided
      const date = cryptoUtil.dateFormat(req.query.date)
      cryptoSelect = JSON.parse(await cache.hGet('crypto-Dates', date))
      cryptoSelect = cryptoSelect[req.params.name] || null
      if (!cryptoSelect) return next()
      cryptoGetByData = true
    }
    const crypto = cryptoSelect ?? JSON.parse(await cache.get(req.params.name))
    const time = getTimeout(crypto.lastest.timestamp)
    const isExpired = time > oneHourToExpire
    if (isExpired && !cryptoGetByData) {
      next()
      return
    }
    res.status(200).send(await cryptoUtil.parser(crypto))
  } catch (e) {
    if (e instanceof TypeError) {
      next()
      return
    }
    responseError.SendError(e, res)
  }
}
exports.getTop50 = async (req, res, next) => {
  try {
    let topSelect = null
    let topGetByDate = false
    if (req.query.force === 'true') return next() // if force is true then go to next middleware
    if (req.query.date) {
      // if date is provided
      const date = cryptoUtil.dateFormat(req.query.date)
      topSelect = await cache.hGet('top50-Dates', date)
      if (!topSelect) return next()
      topSelect = JSON.parse(topSelect)
      topGetByDate = true
    }
    // if date is not provided
    const top50 = topSelect ?? JSON.parse(await cache.get('top50')).top
    if (!topGetByDate) {
      const time = getTimeout(top50.timestamp)
      if (time > oneDayToExpire) next()
    }
    res.status(200).send(top50)
  } catch (e) {
    // top50 is not available in cache
    if (e instanceof TypeError) {
      next()
      return
    }
    responseError.SendError(e, res)
  }
}
