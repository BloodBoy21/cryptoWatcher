const { Crypto, Top50 } = require('../models')
const { getCryptoData, getTop50, readCoins } = require('../scrapper')
const { cryptoUtil, responseError } = require('../utils')
const cache = require('../cache')

async function getByDate(req, res) {
  const { name } = req.params
  const { date } = req.query
  const data = await Crypto.getByDate(name, cryptoUtil.dateFormat(date))
  if (!data.length) throw responseError.NotFoundError('Date not found')
  const dataInCache = JSON.parse(
    await cache.hGet('crypto-Dates', `${cryptoUtil.dateFormat(date)}`)
  )
  if (dataInCache) dataInCache[name] = data
  cache.hSet(
    'crypto-Dates',
    `${cryptoUtil.dateFormat(date)}`,
    JSON.stringify(dataInCache ?? { [name]: data })
  )
  res.status(200).send(data)
}
exports.getCrypto = async (req, res) => {
  try {
    // if date is provided
    if (req.query.date) {
      return getByDate(req, res)
    }
    const { name } = req.params // name of the crypto
    const cryptoData = await getCryptoData(name) // get crypto data from scrapper
    if (!cryptoData) throw responseError.NotFoundError('Crypto not found')
    let crypto = await new Crypto({ name, lastest: cryptoData })
    const saveInCache = async (crypto) => {
      const name = crypto.name
      delete crypto.name
      await cache.set(name, JSON.stringify(crypto))
    }
    if (!(await cache.exists(name))) {
      // if crypto is not found in cache
      await crypto.save()
      await saveInCache(crypto)
    } else {
      // if crypto is found in cache
      const cryptoInCache = JSON.parse(await cache.get(name))
      const cryptoSaved = await Crypto.findById(cryptoInCache._id)
      cryptoSaved.lastest = crypto.lastest
      await cryptoSaved.save()
      await saveInCache(cryptoSaved)
      crypto = cryptoSaved
    }
    res.status(200).send(await cryptoUtil.parser(crypto))
  } catch (error) {
    responseError.SendError(error, res)
  }
}

exports.getTop50 = async (req, res) => {
  try {
    const { date } = req.query
    if (date) {
      // if date is provided
      const topSelect = await Top50.findOne({
        timestamp: {
          $gte: new Date(date),
          $lt: new Date(date).setDate(new Date(date).getDate() + 1)
        }
      })
      if (!topSelect) throw responseError.NotFoundError('Date not found')
      cache.hSet(
        'top50-Dates',
        `${cryptoUtil.dateFormat(date)}`,
        JSON.stringify(topSelect.top)
      )
      return res.status(200).send(topSelect)
    }
    // if date is not provided
    const top = await getTop50() // get top 50 cryptos from scrapper
    const top50 = await new Top50({ top })
    await top50.save() // save top 50 cryptos in database
    cache.set('top50', JSON.stringify(top50)) // save top 50 cryptos in cache
    res.status(200).send(top)
  } catch (error) {
    responseError.SendError(error, res)
  }
}
exports.getCoins = async (req, res) => {
  try {
    const coins = await readCoins()
    const coinsParsed = Object.keys(coins).map((coin) => {
      return coin.toLowerCase()
    })
    res.status(200).send(coinsParsed)
  } catch (error) {
    responseError.SendError(error, res)
  }
}
