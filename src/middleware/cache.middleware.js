const cache = require('../cache')
const getTimeout = (timestamp) => {
  return Date.now() - new Date(timestamp)
}
exports.getCrypto = async (req, res, next) => {
  try {
    if (!req.params.name) {
      return res.status(400).send({ message: 'Name is required' })
    }
    const name = req.params.name
    if (await cache.exists(name)) {
      const crypto = JSON.parse(await cache.get(name))
      const timeToExpire = 1000 * 60 * 60 // 1 hour
      const isExpired = getTimeout(crypto.lastest.timestamp) > timeToExpire
      if (isExpired) {
        next()
      } else {
        res.status(200).send(crypto)
      }
    } else {
      next()
    }
  } catch {
    res.status(500).send({ message: 'Internal server error' })
  }
}
exports.getTop50 = async (req, res, next) => {
  try {
    if (await cache.exists('top50')) {
      const topInCache = JSON.parse(await cache.get('top50'))
      const timeToExpire = 1000 * 60 * 60 * 24 // 1 day
      const isExpired = getTimeout(topInCache.timestamp) > timeToExpire
      if (isExpired) {
        next()
      } else {
        res.status(200).send(topInCache.top)
      }
    } else {
      next()
    }
  } catch {
    res.status(500).send({ message: 'Internal server error' })
  }
}
