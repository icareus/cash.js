// const util = require('util')

const binance = require('node-binance-api')

const {
  APIKEY,
  APISECRET
} = process.env

binance.options({
  APIKEY,
  APISECRET,
  useServerTime: true, // sync to server time at startup
  test: true // Sandbox mode for development !!!
})

// binance.buy = util.promisify(binance.buy)
// binance.sell = util.promisify(binance.sell)

module.exports = binance

// onBalances = balances => Object.keys(balances).reduce((assets, ast) => { const asset = balances[ast] ; return (+asset.available || +asset.onOrder ? {...assets, [ast]: asset} : assets)}, {})
// B.balance((_, balances) => console.log(onBalances(balances)))
