const express = require('express')
const app = express()
const morgan = require('morgan')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const path = require('path')
const { apiRouter, rootRouter } = require('./routes')
require('./db')
const cache = require('./cache')
cache.connect()
if (process.env.NODE_ENV !== 'production') {
  console.log('Running in development mode')
  const livereload = require('livereload')
  const liveReloadServer = livereload.createServer()
  liveReloadServer.watch(path.join(__dirname, 'views'))
  const connectLivereload = require('connect-livereload')
  app.use(connectLivereload())
}
// middleare
app.use(morgan('dev'))
app.use(bodyParser.json())
app.use(cookieParser())
app.use(cors())
app.use(express.static(path.join(__dirname, 'public')))
app.set('views', path.join(__dirname, 'views'))
// template engine
app.engine('html', require('express-es6-template-engine'))
app.set('view engine', 'html')
// routes
app.use('/', rootRouter)
app.use('/api', apiRouter)

module.exports = app
