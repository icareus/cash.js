const redux = require('redux')
const { sortBids, sortAsks } = require('node-binance-api')

const market = (state = {}, update) => {
  switch (update.type) {
    case 'update.depth':
      return ({
        ...state,
        [update.symbol]: {
          ...(state[update.symbol] || {}), // foolproof ?
          bids: sortBids(update.depth.bids),
          asks: sortAsks(update.depth.asks)
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
