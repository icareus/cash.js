const binance = require('./util/binance')
const outputLog = require('./util/log')

const store = require('./store')
const snapshot = require('./store/selectors')

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
  console.log(`${new Date().toISOString()}`)
  const data = snapshot(store.getState())

  const arbitrages = Object.keys(data).reduce(
    (acc, symbol) => {
      const { arbitrage } = data[symbol]

      if (arbitrage > 1) {
        outputLog(`${new Date().toISOString()} ${symbol} ${arbitrage}`)
      }
      return {
        ...acc,
        [symbol]: arbitrage
      }
    }
  , {})

  console.log(arbitrages)
})
