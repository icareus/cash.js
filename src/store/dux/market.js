const B = require('../../util/B')

const Symbol = symbol => (state = { symbol }, update) => {
  const {
    bestAsk: ask = state.ask,
    bestBid: bid = state.bid
  } = update.data

  const newState = {
    ...state,
    ask,
    bid,
    spread: B(ask).minus(bid)
  }
  return newState
}

const market = (state = {}, update) => {
  if (update.type === 'update.symbols') {
    state = Object.keys(update.symbols).reduce((state, symbol) => {
      const {
        bidPrice: bid,
        askPrice: ask
      } = update.symbols[symbol]
      return ({
        ...state,
        [symbol]: {
          bid,
          ask,
          spread: Number(ask) - Number(bid),
        }
      })
    }, {})
    return state
  } else if (update.type === 'update.symbol') {
    return {
      ...state,
      [update.data.symbol]: Symbol(update.data)(state[update.data.symbol], update)
    }
  } else {
    return state
  }
}

module.exports = market
