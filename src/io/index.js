const api = require('./api')
const binance = require('./binance')
const log = require('./log')

const srv = require('http').Server(api)
const socket = require('./socket')(srv)

const noport = (port = 3000) => {
  console.log(`No port provided in env. Using ${port}`)
  return port
}

module.exports = {
  api,
  binance,
  log,
  socket,
  srv
}

// If NO_WEBUI is set, don't start webserver
process.env.NO_WEBUI || (_ => {
  const { PORT: port = noport() } = process.env
  srv.listen(port, console.log(`Web interface up on ${port}`))
})
