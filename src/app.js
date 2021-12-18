const express = require('express')
const app = express()
const morgan = require('morgan')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const { apiRouter } = require('./routes')
require('./db')
const cache = require('./cache')
cache.connect()
// middleare
app.use(morgan('dev'))
app.use(bodyParser.json())
app.use(cookieParser())
app.use(cors())
// routes
app.use('/api', apiRouter)

module.exports = app
