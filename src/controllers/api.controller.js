const { Crypto, Top50 } = require('../models')
const { getCryptoData, getTop50, readCoins } = require('../scrapper')
const { cryptoUtil } = require('../utils')
const cache = require('../cache')
exports.getCrypto = async (req, res) => {
  try {
    const name = req.params.name.toLowerCase() // name of the crypto
    const cryptoData = await getCryptoData(name) // get crypto data from scrapper
    if (!cryptoData) {
      return res.status(404).send({ message: 'Crypto not found' })
    }
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
      const id = cryptoInCache._id
      const cryptoSaved = await Crypto.findById(id)
      cryptoSaved.lastest = crypto.lastest
      await cryptoSaved.save()
      await saveInCache(cryptoSaved)
      crypto = cryptoSaved
    }
    res.status(200).send(await cryptoUtil.parser(crypto))
  } catch (error) {
    res.status(500).send({
      message: error.message
    })
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
      if (!topSelect) {
        // if date is not found in cache
        return res.status(404).send({ message: 'Top50 not found' })
      }
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
    res.status(500).json({
      message: error.message
    })
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
    res.status(500).send({
      message: error.message
    })
  }
}
