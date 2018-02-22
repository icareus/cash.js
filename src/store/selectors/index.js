const binance = require('../../util/binance')

const view = (state = {}) => Object.keys(state).reduce((acc, symbol) => {
  const view = {
    bid: binance.first(state[symbol].bids || {}),
    ask: binance.first(state[symbol].asks || {}),
    mkt: state[symbol].market
  }
  view.spread = (view.ask - view.bid)
    .toFixed(view.ask
        ? view.ask.split('.')[1].length
        : 1)
  // const arbitrage0 = spread - (view.ask * 0.998 * view.bid * 0.998)
  // const arbitrage1 = spread - (view.ask * 0.9985 * view.bid * 0.9985)
  // const arbitrage2 = (view.ask * 0.9985 + spread) * 0.9985 - view.ask
  return ({
    ...acc,
    [symbol]: view
  })
}, {})

module.exports = view
