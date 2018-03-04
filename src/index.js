const binance = require('./io/binance')
const hardLog = require('./io/hardLog')
const io = require('./util/io')

// const {
//   findPair
// } = require('./util')

const store = require('./store')
const {
  paths: graph
} = require('./store/selectors')

const { markets: symbols } = require('./util/constants')
const { watch: paths } = require('./util/constants')

hardLog(`// LOG_START ${new Date().toISOString()}`)
// console.log({ symbols })
// console.log({ paths })

binance.websockets.depthCache(symbols, (symbol, depth) => {
  // That's all, folks !
  let { bids, asks } = depth

  bids = binance.sortBids(bids)
  asks = binance.sortAsks(asks)

  const action = { type: 'update.symbol',
    symbol,
    ask: binance.first(asks),
    bid: binance.first(bids),
    asks,
    bids
  }

  store.dispatch(action)
  io.emit(action)
})

// TODO : Watch market also ? (for OHLC graphs)
// binance.websockets.trades(symbols, (trades) => {
//   const {
//     // e:eventType,
//     E:timestamp,
//     s:symbol,
//     p:price,
//     q:quantity,
//     m:maker,
//     a:tradeId
//   } = trades
//   const action = {
//     type: 'update.trade',
//     timestamp: new Date(timestamp).toISOString(),
//     trades
//   }
//   console.log(symbol, price)
//   store.dispatch(action)
// })

store.subscribe(_ => {
  console.clear()

  const state = store.getState()
  // io.volatile.emit('state', state)

  const currentGraph = graph(state)
  // io.emit('graph', currentGraph)

  const costFn = require('./util/cost')(currentGraph)

  const threshold = {
    high: 1.005,
    mid: 1.001,
    low: 0.999
  }

  const BELL = '\u0007'

  console.log(currentGraph)
  const arbitrages = paths.reduce((acc, path) => {
    const leverage = costFn(path).toFixed(8)
    // const timeStamp = new Date().toISOString()
    const arbitrage = {
      arbitrage: path.join('->'),
      leverage,
      // timeStamp
      v2: path.reduce((coeffs, asset) => {
        return {
          ...coeffs,
          [asset]: currentGraph[asset]
        }
      }, {})
    }
    if (+leverage > threshold.high) {

    }

    return [...acc, arbitrage]
  }, []).sort((a1, a2) => a1.leverage > a2.leverage)

  const logworthy = arbitrages
    .filter(arb => +arb.leverage > threshold.low)
  console.log(logworthy)

  const mindworthy = arbitrages
    .filter(arb => +arb.leverage > threshold.mid)

  if (mindworthy.length) {
    console.log(BELL)
  }
  io.emit('arbitrages', logworthy)
})
