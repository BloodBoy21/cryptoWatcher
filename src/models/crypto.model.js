const mongoose = require('mongoose')
const Schema = mongoose.Schema

const cryptoSchema = new Schema({
  name: String,
  lastest: {
    price: String,
    marketCap: String,
    volume: String,
    percent: String,
    timestamp: {
      type: Date,
      default: Date.now()
    }
  },
  history: { type: [Object], default: [] }
})
cryptoSchema.pre('save', function () {
  this.history.push(this.lastest)
})
cryptoSchema.statics.getByDate = function (coin, date) {
  return this.findOne({ name: coin }).then((crypto) => {
    return crypto.history.filter((history) => {
      return history.timestamp.toISOString().split('T')[0] === date
    })
  })
}

module.exports = mongoose.model('Crypto', cryptoSchema)
