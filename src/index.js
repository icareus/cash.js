const binance = require('./io/binance')
// const hardLog = require('./io/hardLog')
const io = require('./util/io')

const store = require('./store')
const {
  paths,
  graph
} = require('./store/selectors')

const { markets: symbols } = require('./util/constants')
const { watch: geometries } = require('./util/constants')

const BELL = '\u0007'
const threshold = {
  high: 1.005,
  mid: 1.001,
  low: 0.999
}

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
  // io.volatile.emit('paths', currentPaths)
  const costFn = require('./util/cost')(currentPaths)
  const leverages = geometries
    .map(path => ({ path, leverage: costFn(path) }))
    .sort((a1, a2) => a1.leverage > a2.leverage)
  const logworthy = leverages
    // .filter(arb => +arb.leverage > threshold.low)
  console.log(`leverages -------------------- v`)
  console.log(JSON.stringify(logworthy, null, 2))
  console.log(`-------------------- leverages ^`)

  const currentGraph = graph(state)
  console.log(`Graph ------------------------ v`)
  console.log(JSON.stringify(currentGraph, null, 2))
  console.log(`------------------------ Graph ^`)
  // io.emit('graph', currentGraph)
  const arbiter = require('./util/arbitrage')(currentGraph)
  const arbitrages = geometries
    .map(geom => arbiter(geom))
    .sort((a1, a2) => a1.output > a2.output)

  const mindworthy = arbitrages
    .filter(arb => +arb.output > threshold.mid)
  console.log(`Arbitrages -------------------- v`)
  console.log(JSON.stringify(mindworthy, null, 2))
  console.log(`-------------------- Arbitrages ^`)

  if (mindworthy.length) {
    console.log(BELL)
  }
  // io.emit('arbitrages', logworthy)
  console.log(`================== TICK ^`)
})
