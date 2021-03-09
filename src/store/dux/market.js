const { combineReducers } = require('redux')

// TODO : Object as reducer build from symbols plz
const Symbol = symbol => (state = { symbol }, update) => {
  const {
    ask, bid, asks, bids
  } = update
  return update.symbol === symbol
    ? { symbol, ask, bid, asks, bids }
    : state
}

const { markets: symbols } = require('../../util/constants')

const markets = symbols.reduce((reducers, symbol) => {
  return {...reducers, [symbol]: Symbol(symbol)}
}, {})

const market = combineReducers(markets)

module.exports = market
