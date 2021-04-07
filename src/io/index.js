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
const {
  PORT: port = noport(),
  HOST: hostname = '127.0.0.1'
} = process.env
srv.listen(port, hostname, _ => console.log(`Listening on ${hostname}:${port}`))
