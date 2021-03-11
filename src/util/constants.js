const markets = Object.keys(require('../../exchangeInfo.json'))

const constants = {
  fee: 0.075 / 100,
  hyper: {
    greed: process.env.GREED || 0.1,
  },
  markets,
  thresholds: {
    high: 1.001,
    mid: 1.0001,
    low: 0.975
  },
  // TODO - Generate all ?
  tokens: [
    'BNB',
    'BTC',
    'BUSD',
    'ETH',
    'LTC',
    'TRX',
    'USDT',
    'NEO',
    'XLM',
    'XRP'
  ],
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

// TODO: Better init & stuff.

module.exports = constants
