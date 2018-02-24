const { binance, fixedTo } = require('../../util')

const view = (state = {}) => Object.keys(state).reduce((acc, symbol) => {
  const view = {
    bid: binance.first(state[symbol].bids || {}),
    ask: binance.first(state[symbol].asks || {}),
    mkt: state[symbol].market
  }
  view.spread = fixedTo(view.ask, (view.ask - view.bid || 0))
  view.arbitrage = fixedTo(view.ask, (((0.999 * view.bid) / view.ask) * 0.999))

  return ({
    ...acc,
    [symbol]: view
  })
}, {})

module.exports = view
