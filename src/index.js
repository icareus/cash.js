const {
  binance,
  hardLog
} = require('./util')

const store = require('./store')
const snapshot = require('./store/selectors')

const symbols = [
  'LTCETH', 'LTCBTC', 'LTCBNB',
  'ETHBTC', 'BNBETH', 'BNBBTC',
  'NEOBNB', 'NEOBTC', 'NEOETH'
]

hardLog(`LOG_START ${new Date().toISOString()}`)

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
        hardLog(JSON.stringify({
          type: 'arbitrage.status',
          path: [ symbol.slice(0, 3), symbol.slice(3), symbol.slice(0, 3) ],
          status: +arbitrage > 1
            ? `earn ${fixedTo(arbitrage, (+arbitrage - 1))}`
              : +arbitrage < 1
              ? `loss ${fixedTo(arbitrage, (+arbitrage - 1))}`
              : 'unkn'
        }, null, 2))
      }
      return {
        ...acc,
        [symbol]: arbitrage
      }
    }
  , {})

  console.log(arbitrages)
})
