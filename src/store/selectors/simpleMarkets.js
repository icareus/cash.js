const { fixedTo } = require('../../util')

module.exports = (state = {}) => Object.keys(state.market || {}).reduce((mkt, symbol) => {
  const { bid, ask, market } = state.market[symbol]
  const spread = fixedTo(ask, (ask - bid))

  return ({
    ...mkt,
    [symbol]: {
      ask,
      bid,
      market,
      spread
    }
  })
}, {})
