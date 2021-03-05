// const market = require("../store/dux")

const constants = {
  test: true,
  fee: 0.1 / 100,
  hyper: {
    greed: 0.3
  },
  markets: [
    'BNBUSDT',
    'NEOBNB',
    'NEOUSDT',
    'LTCBNB',
    'LTCUSDT',
    'XLMBNB',
    'XLMUSDT'
  ],
  thresholds: {
    high: 1.05,
    mid: 1.00005,
    low: 0.95
  },
  // TODO - Generate all ?
  tokens: ['BNB', 'USDT', 'NEO', 'LTC', 'XLM'],
}

constants.watchlist = constants.tokens.reduce((list, token) => [
  ...list,
  ...constants.tokens.filter(tok => tok != token).reduce((acc, tok, _, toks) => [
    ...acc,
    ...toks.filter(t => t != tok).map(t => [
      token,
      tok,
      t
    ])
  ], [])
], []).filter(triangle => {
  let valid = false
  triangle.forEach((token, index) => {
    valid = constants.markets.includes(''+token+triangle[(index + 1) % 3])
      || constants.markets.includes(''+triangle[(index + 1) % 3]+token)
      ? true
      : false
  })
  return valid
})

// const assets = constants.markets.reduce((assets, symbol) => {
//   const asset = symbol.slice(0, 3)
//   const currency = symbol.slice(3)
//
//   return assets.concat([asset, currency].filter(x => assets.indexOf(x) === -1))
// }, [])
// console.log(assets)

// TODO: Better init & stuff.

module.exports = constants
