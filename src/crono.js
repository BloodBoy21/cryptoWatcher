const cron = require('node-cron')
const { getTop50 } = require('../src/scrapper')
const { Top50 } = require('../src/models')
const { cryptoUtil } = require('../src/utils')
const cache = require('../src/cache')
const log = require('loglevel')
// Cron task to get top50 data every day at 00:00 AM (UTC) and save it to database
const top50Cron = cron.schedule(
  '0 0 * * *',
  async () => {
    try {
      const top50 = await new Top50(await getTop50())
      await top50.save()
      await cache.set('top50', JSON.stringify(top50.top))
      const dateToCache = cryptoUtil.dateFormat(top50.timestamp)
      cache.hSet('top50-Dates', `${dateToCache}`, JSON.stringify(top50.top))
      log.info(`Top50 data updated at ${new Date(top50.timestamp)}`)
    } catch (error) {
      log.error(error)
    }
  },
  {
    scheduled: false,
    timezone: 'America/Mexico_City'
  }
)

module.exports = top50Cron
