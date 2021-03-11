const { combineReducers } = require('redux')

const Symbol = symbol => (state = { symbol }, update) => {
  const {
    ask = state.ask,
    bid = state.bid,
    asks = state.asks,
    bids = state.bids
  } = update
  return {
    ...state,
    ask,
    bid,
    asks: Object.keys(asks).length
      ? asks
      : state.asks,
    bids: Object.keys(bids).length
      ? bids
      : state.bids,
  }
}

const { markets: symbols } = require('../../util/constants')

const markets = symbols.reduce((reducers, symbol) => {
  return {...reducers, [symbol]: Symbol(symbol)}
}, {})

const market = (state = {}, update) => {
  if (update.type === 'update.symbols') {
    state = update.symbols.reduce((state, { symbol, bidPrice, askPrice }) => ({
      ...state,
      [symbol]: {
        bid: bidPrice,
        ask: askPrice,
        spread: Number(askPrice) - Number(bidPrice),
      }
    }), state)
    return state
  } else if (update.type === 'update.symbol') {
    return {
      ...state,
      [update.symbol]: Symbol(update.symbol)(state[update.symbol], update)
    }
  } else {
    return state
  }
}

module.exports = market
