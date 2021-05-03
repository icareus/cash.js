const B = require('../../util/B')

const Symbol = symbol => (state = { symbol }, update) => {
  const {
    bid,
    ask,
    id
  } = update.data
  if (state.id && state.id > id) {
    console.log(`Declined update ${id} on ${symbol}`)
    return state
  }

  const newState = {
    ...state,
    id,
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
      const spread = B(ask).minus(bid)
      // if (symbol === '') {
        // console.log(`Symbol: ${symbol}, spread: ${spread}`)
      // }
      return ({
        ...state,
        [symbol]: {
          bid,
          ask,
          spread
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
