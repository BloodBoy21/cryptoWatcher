const cache = require('../cache')
const oneHourToExpire = 1000 * 60 * 60 // 1 hour
const oneDayToExpire = 1000 * 60 * 60 * 24 // 1 day
const { cryptoUtil } = require('../utils')
const getTimeout = (timestamp) => {
  return Date.now() - new Date(timestamp)
}
exports.getCrypto = async (req, res, next) => {
  try {
    if (!req.params.name) {
      res.status(400).send({ message: 'Crypto name is required' })
    }
    const name = req.params.name.toLowerCase()
    const crypto = JSON.parse(await cache.get(name))
    const time = getTimeout(crypto.lastest.timestamp)
    const isExpired = time > oneHourToExpire
    if (isExpired) {
      next()
      return
    }
    res.status(200).send(await cryptoUtil.parser(crypto))
  } catch (e) {
    if (e instanceof TypeError) {
      next()
      return
    }
    res.status(500).send({ message: 'Internal server error' })
  }
}
exports.getTop50 = async (req, res, next) => {
  try {
    const goToNext = []
    req.query.force === 'true' ? goToNext.push(true) : goToNext.push(false)
    if (req.query.date) {
      // if date is provided
      const date = cryptoUtil.dateFormat(req.query.date)
      const topSelect = await cache.hGet('top50-Dates', date)
      if (topSelect) {
        res.status(200).send(JSON.parse(topSelect))
        return
      }
      goToNext.push(true)
    }
    // if date is not provided
    const top50 = JSON.parse(await cache.get('top50'))
    const time = getTimeout(top50.timestamp)
    const isExpired = time > oneDayToExpire
    if (isExpired || goToNext.includes(true)) {
      next()
      return
    }
    res.status(200).send(top50.top)
  } catch (e) {
    // top50 is not available in cache
    if (e instanceof TypeError) {
      next()
      return
    }
    res.status(500).send({ message: 'Internal server error' })
  }
}
