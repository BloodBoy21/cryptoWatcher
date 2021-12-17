const mongoose = require('mongoose')
const { MONGO_URI } = require('./conf')
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection
db.on('error', console.error.bind(console, 'MongoDB connection error:'))
db.once('open', () => console.log('MongoDB connected!'))
db.on('disconnected', () => console.log('MongoDB disconnected!'))

module.exports = db
