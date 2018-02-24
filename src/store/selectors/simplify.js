const {
  // binance,
  fixedTo
} = require('../../util')

const simplify = (state = {}) => Object.keys(state).reduce((acc, symbol) => {
  const { bid, ask, market } = state[symbol]
  spread = fixedTo(ask, (ask - bid || 0))
  arbitrage = fixedTo(ask, (((0.999 * bid) / ask) * 0.999))

  return ({
    ...acc,
    [symbol]: {
      ask,
      bid,
      spread,
      arbitrage
    }
  })
}, {})

module.exports = simplify
