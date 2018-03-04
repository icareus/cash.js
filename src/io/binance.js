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

// onBalances = balances => Object.keys(balances).reduce((assets, ast) => { const asset = balances[ast] ; return (+asset.available || +asset.onOrder ? {...assets, [ast]: asset} : assets)}, {})
// B.balance((_, balances) => console.log(onBalances(balances)))
