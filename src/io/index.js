const api = require('./api')
const binance = require('./binance')
const log = require('./log')

const srv = require('http').Server(api)
const socket = require('./socket')(srv)

const noport = (port = 3000) => {
  console.log(`No port provided in env. Using ${port}`)
  return port
}
const { PORT: port = noport() } = process.env

module.exports = {
  api,
  binance,
  log,
  socket,
  srv
}

srv.listen(port, console.log(`Web interface up on ${port}`))
