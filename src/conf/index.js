const path = require('path')
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config({
    path: path.join(__dirname, '../.env')
  })
}
module.exports = {
  MONGO_URI: process.env.MONGO_URI,
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || 3000
}
