const {
  binance,
  log,
  socket: io
} = require('./io')

const {
  paths,
  graph
} = require('./store/selectors')
const store = require('./store')

const {
  watch: geometries,
  markets: symbols,
  thresholds
} = require('./util/constants')

const BELL = '\u0007'

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
  console.log(`================== TICK v`)

  const state = store.getState()
  // io.volatile.emit('state', state)

  const currentPaths = paths(state)
  console.log(`Paths ------------------------ v`)
  console.log(currentPaths)
  console.log(`------------------------ Paths ^`)
  io.volatile.emit('paths', currentPaths)
  const costFn = require('./util/cost')(currentPaths)
  const leverages = geometries
    .map(path => ({ path, leverage: costFn(path) }))
    .sort((a1, a2) => a1.leverage > a2.leverage)
  const logworthy = leverages
    // .filter(arb => +arb.leverage > thresholds.low)
  console.log(`leverages -------------------- v`)
  console.log(JSON.stringify(logworthy, null, 2))
  console.log(`-------------------- leverages ^`)

  const currentGraph = graph(state)
  console.log(`Graph ------------------------ v`)
  console.log(JSON.stringify(currentGraph, null, 2))
  console.log(`------------------------ Graph ^`)
  io.volatile.emit('graph', currentGraph)
  const arbiter = require('./util/arbitrage')(currentGraph)
  const arbitrages = geometries
    .map(geom => arbiter(geom))
    .sort((a1, a2) => a1.output > a2.output)

  const mindworthy = arbitrages
    .filter(arb => +arb.output > thresholds.mid)
  console.log(`Arbitrages -------------------- v`)
  console.log(JSON.stringify(mindworthy, null, 2))
  console.log(`-------------------- Arbitrages ^`)

  const costworthy = mindworthy
    .filter(arb => +arb.output > thresholds.high)
  if (costworthy.length) {
    console.log(BELL)
    log.hard(...costworthy)
  }
  io.emit('arbitrages', costworthy)
  console.log(`================== TICK ^`)
})
