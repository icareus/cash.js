const lock = require('./util/lock')
const passThrough = require('./util/passThrough')

const {
  binance,
  log,
  socket: io
} = require('./io')

// const amount = 0.15 -> NEO
const amount = 12// -> USDT
// const amount = 1.5// -> BNB

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

const negotiate = require('./util/negociate')
const die = require('./util/die')

store.subscribe(_ => {
  const state = store.getState()

  const arbiter = require('./util/arbitrage')(state)
  const watchOrders = require('./util/watchOrders')

  const arbitrages = geometries
    .map(geom => arbiter(geom, amount))
    .sort((a1, a2) => a1.output > a2.output)// Highest last

  const mindworthy = arbitrages
    .filter(arb => B(arb.output).gt(B(thresholds.low).times(amount)))

  const costworthy = mindworthy
    .filter(arb => B(arb.output).gt(B(thresholds.mid).times(amount)))

  if (costworthy.length) {
    const arbitrage = costworthy[costworthy.length - 1]
    const key = lock(arbitrage)

    if (key) {
      console.clear()
      console.log(`Got lock: ${key}`)

      negotiate(arbitrage)
        .then(passThrough(log.hard))
          .catch(e => console.error(`!!! Logging error /: !!!`))
        .then(passThrough(x => console.log(JSON.stringify(x, null, 2))))
        .then(watchOrders)
          .catch(die)
        .then(passThrough(r => console.log(JSON.stringify(r, null, 2), 'Resolved.')))
        // .then(lock.unlock(key))
        // .then(_ => setTimeout(_ => lock.unlock(key), 5000))
    }// else { console.log(JSON.stringify(costworthy, null, 2)) }
  } else { console.log(JSON.stringify(mindworthy, null, 2)) }
  io.emit('state', simplify(state))
  // console.log(`================== TICK ^`)
})
