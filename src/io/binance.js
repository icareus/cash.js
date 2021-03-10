const { test } = require('../util/constants')

const Binance = require('node-binance-api')

const {
  APIKEY,
  APISECRET
} = process.env

const binance = new Binance().options({
  APIKEY,
  APISECRET,
  useServerTime: true, // sync to server time at startup
  recvWindow: 60000,
  test // Sandbox mode for development !!!
})

// binance.buy = util.promisify(binance.buy)
// binance.sell = util.promisify(binance.sell)

module.exports = binance

// onBalances = balances => Object.keys(balances).reduce((assets, ast) => { const asset = balances[ast] ; return (+asset.available || +asset.onOrder ? {...assets, [ast]: asset} : assets)}, {})
// B.balance((_, balances) => console.log(onBalances(balances)))
