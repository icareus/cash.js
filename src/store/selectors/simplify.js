const { fixedTo } = require('../../util')

module.exports = (state = {}) => Object.keys(state).reduce((acc, symbol) => {
  const { bid, ask, market } = state[symbol]
  const spread = fixedTo(ask, (ask - bid))
  return ({
    ...acc,
    [symbol]: {
      ask,
      bid,
      market,
      spread
    }
  })
}, {})
