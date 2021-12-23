const { createClient } = require('redis')
let client
if (process.env.NODE_ENV !== 'production') {
  client = createClient()
} else {
  client = createClient(process.REDIS_TLS_URL)
}

client.on('error', (err) => console.log('Redis Client Error', err))

module.exports = client
