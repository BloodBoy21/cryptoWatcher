const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Top50Schema = new Schema(
  {
    top: { type: [Object], ref: 'Crypto' },
    timestamp: {
      type: Date,
      default: Date.now()
    }
  },
  { strict: false }
)
module.exports = mongoose.model('Top50', Top50Schema)
