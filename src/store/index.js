const redux = require('redux')
const { first, sortBids, sortAsks } = require('node-binance-api')

const market = (state = {}, update) => {
  switch (update.type) {
    case 'update.depth':
      const bids = sortBids(update.depth.bids)
      const asks = sortAsks(update.depth.asks)

      return ({
        ...state,
        [update.symbol]: {
          bid: first(bids),
          ask: first(asks),
          bids,
          asks
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
