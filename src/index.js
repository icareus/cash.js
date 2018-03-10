const {
  binance,
  log,
  socket: io
} = require('./io')

const {
//   paths,
//   graph,
  simplify
} = require('./store/selectors')
const store = require('./store')

const {
  watch: geometries,
  markets: symbols,
  thresholds
} = require('./util/constants')

const B = require('./util/B')

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

// Dirty dirty me...
// global.lock = false
const negotiate = require('./util/negociate')
const die = require('./util/die')

store.subscribe(_ => {
  if (!global.lock) { console.clear() }
  // console.log(`================== TICK v`)

  const state = store.getState()

  const arbiter = require('./util/arbitrage')(state)
  const amount = 0.1

  const arbitrages = geometries
    .map(geom => arbiter(geom, amount))
    .sort((a1, a2) => a1.output > a2.output)

  const mindworthy = arbitrages
    .filter(arb => B(arb.output).gt(
      B(thresholds.low).times(amount)))

  // console.log(`Arbitrages -------------------- v`)
  // console.log(JSON.stringify(mindworthy, null, 2), mindworthy.length)
  // console.log(`-------------------- Arbitrages ^`)

  const costworthy = mindworthy
    .filter(arb => B(arb.output).gt(
      B(thresholds.mid).times(amount)))

  if (costworthy && costworthy.length) {
    if (!global.lock) {
      // global.lock = costworthy[costworthy.length - 1]
      negotiate(costworthy[costworthy.length - 1])
        .then(die)
    }
    log.hard(costworthy)
      .catch(e => console.log(`Couldn't log stuff.`))
      .then(logged => console.log(`Logged ${logged.length} arbitrages.`))

    io.emit('arbitrages', costworthy)
  } else if (!global.lock) {
    console.log(
      JSON.stringify(mindworthy, null, 2),
      mindworthy.length)
  }
  io.emit('state', simplify(state))
  // console.log(`================== TICK ^`)
})
