const { Crypto, Top50 } = require('../models')
const { getCryptoData, getTop50 } = require('../scrapper')
const { cryptoUtil } = require('../utils')
const cache = require('../cache')

exports.getCrypto = async (req, res) => {
  try {
    const { name } = req.params // name of the crypto
    const cryptoData = await getCryptoData(name) // get crypto data from scrapper
    if (!cryptoData) {
      return res.status(404).send({ message: 'Crypto not found' })
    }
    let crypto = await new Crypto({ name, lastest: cryptoData })
    const saveInCache = async (crypto) => {
      const name = crypto.name
      delete crypto.name
      await cache.set(name, JSON.stringify(await cryptoUtil.parser(crypto)))
    }
    if (!(await cache.exists(name))) {
      await crypto.save()
      await saveInCache(crypto)
    } else {
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
    res.status(500).json({
      message: error.message
    })
  }
}

exports.getTop50 = async (req, res) => {
  try {
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
