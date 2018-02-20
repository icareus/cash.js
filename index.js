require('dotenv').config()

const binance = require('node-binance-api')
const redux = require('redux')

const {
  APIKEY,
  APISECRET
} = process.env

console.log({ APIKEY, APISECRET })

binance.options({
  APIKEY,
  APISECRET,
  useServerTime: true, // If you get timestamp errors, synchronize to server time at startup
  test: true // If you want to use sandbox mode where orders are simulated
})

const symbols = [
  'LTCETH', 'LTCBTC', 'LTCBNB',
  'ETHBTC', 'BNBETH', 'BNBBTC'
]

const graph = symbols.reduce((g, s) => ({
  ...g,
  [s]: {
    asks: {},
    bids: {}
  }
}), {})
console.log(graph)

const cashReducer = (state = graph, update) => {
  switch (update.type) {
    case 'update.depth':
      return ({
        ...state,
        [update.symbol]: {
          ...state[update.symbol],
          bids: binance.sortBids(update.depth.bids),
          asks: binance.sortAsks(update.depth.asks)
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

const store = redux.createStore(cashReducer)

binance.websockets.depthCache(symbols, (symbol, depth) => {
  console.log(symbol + ' depth cache update')
  store.dispatch({ type: 'update.depth', symbol, depth })
})

binance.websockets.trades(symbols, (trades) => {
  console.log(trades.s + ' trade update')
  store.dispatch({ type: 'update.trade', trades })
})

const simplifyState = state => Object.keys(state).reduce((acc, symbol) => {
  const view = {
    bid: binance.first(state[symbol].bids),
    ask: binance.first(state[symbol].asks),
    mkt: state[symbol].market
  }
  return Object.assign(acc, {[symbol]: view})
}, {})

store.subscribe(_ => {
  const state = store.getState()

  console.log(simplifyState(state))
})
