const Binance = require('node-binance-api')

const {
  APIKEY,
  APISECRET,
  testKey,
  testSecret,
  test
} = process.env

const opts = {
  APIKEY,
  APISECRET,
  // useServerTime: true, // sync to server time at startup
  recvWindow: 60000,
  // test // Sandbox mode for development !!!
}

if (test) {
  opts.urls = {
    base: 'https://testnet.binance.vision/api/',
    combineStream: 'wss://testnet.binance.vision/stream?streams=',
    stream: 'wss://testnet.binance.vision/ws/'
  },
  opts.APIKEY = testKey,
  opts.APISECRET = testSecret
}

const binance = new Binance().options(opts)

module.exports = binance
