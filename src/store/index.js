const redux = require('redux')

const market = (state = {}, update) => {
  switch (update.type) {
    case 'update.depth':
      const { ask, bid, asks, bids } = update
      return ({
        ...state,
        [update.symbol]: { ...state[update.symbol],
          ask,
          bid,
          asks,
          bids
        }
      })
    case 'update.trade':
      let {
        // e: eventType,
        // E: eventTime,
        s: symbol,
        p: price
        // q: quantity,
        // m: maker,
        // a: tradeId
      } = update.trades
      return ({
        ...state,
        [symbol]: { ...state[symbol],
          market: price
        }
      })
  }
}

module.exports = redux.createStore(market)
