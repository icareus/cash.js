console.info('Loading utilities...')
const lock = require('./util/lock')
const passThrough = require('./util/passThrough')
const die = require('./util/die')

console.info('Loading i/o features...')
const {
  binance,
  log,
  socket: io
} = require('./io')

// const amount = 0.15 -> NEO
// const amount = 11// -> USDT
// const amount = 1.5// -> BNB

const {
  simpleMarkets,
  simpleBalances
} = require('./store/selectors')
const store = require('./store')

console.log(`Initializing values...`)
const {
  watchlist: geometries,
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

const initWallets = _ => {
  binance.balance((error, balances) => {
    if ( error ) {
      console.error(error)
      initWallets()
    } else {
      const action = { type: 'update.balances',
        balances
      }
      store.dispatch(action)

      binance.websockets.userData(({ B: updatedBalances }) => {
        const action = { type: 'update.balances',
          balances: updatedBalances.reduce((balances, balance) => ({
            ...balances,
            [balance.a]: {
              available: balance.f,
              onOrder: balance.l
            }
          }), {})
        }
        store.dispatch(action)
        io.emit(action)
      })
    } 
  })
}
initWallets()

const negotiate = require('./util/negotiate')

store.subscribe(_ => {
  const state = store.getState()

  const arbiter = require('./util/arbitrage')(state)
  const watchOrders = require('./util/watchOrders')

  const arbitrages = geometries
    .map(geom => arbiter(geom, state.balances[geom[0]].available))
    .sort((a1, a2) => a1.ratio - a2.ratio)// Highest last

  const mindworthy = arbitrages
    .filter(arb => B(arb.ratio).gt(B(thresholds.low)))

  const costworthy = mindworthy
    .filter(arb => B(arb.ratio).gt(B(thresholds.mid)))

  if (!lock.getActive()) {
    if (costworthy.length) {
      const arbitrage = costworthy[costworthy.length - 1]
      log.hard(arbitrage)
      const key = lock(arbitrage)

      if (key) {
        console.clear()
        console.info(`Got lock: ${key}`)

        negotiate(arbitrage)
          .then(passThrough(log.hard))
            .catch(e => console.error(`!!! Logging error /: !!!`))
          .then(passThrough(x => console.log(JSON.stringify(x, null, 2))))
          .then(watchOrders)
          .then(passThrough(_ => lock.unlock(key)))
            .catch(die)
          .then(passThrough(r => console.log(JSON.stringify(r, null, 2), 'Resolved.')))
      }
    } else {
      const best = mindworthy[mindworthy.length - 1]
      io.emit('graph', best)
      // console.log(JSON.stringify(best, null, 2))
    }
  }//  else { console.log('Lock active.') }
  io.emit('state', {
    ...state,
    balances: simpleBalances(state),
    market: simpleMarkets(state)
  })
})
