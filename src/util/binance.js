const binance = require('node-binance-api')

const {
  APIKEY,
  APISECRET
} = process.env

binance.options({
  APIKEY,
  APISECRET,
  useServerTime: true, // sync to server time at startup
  test: true // Sandbox mode for development
})

module.exports = binance
