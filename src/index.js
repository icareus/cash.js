const binance = require('./util/binance')
const store = require('./store')
const outputLog = require('./util/log')

const symbols = [
  'LTCETH', 'LTCBTC', 'LTCBNB',
  'ETHBTC', 'BNBETH', 'BNBBTC',
  'NEOBNB', 'NEOBTC', 'NEOETH'
]

outputLog(`LOG START: ${new Date().toISOString()}`)

binance.websockets.depthCache(symbols, (symbol, depth) => {
  store.dispatch({ type: 'update.depth', symbol, depth })
})

binance.websockets.trades(symbols, (trades) => {
  store.dispatch({ type: 'update.trade', trades })
})

store.subscribe(_ => {
  process.env.NODE_ENV === 'DEV' && console.log(`${new Date().toISOString()}`)
  const state = store.getState()

  console.log(require('./store/selectors')(state))
})
