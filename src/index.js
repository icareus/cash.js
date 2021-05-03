console.log('Loading utilities...')
const lock = require('./util/lock')
const passThrough = require('./util/passThrough')
const die = require('./util/die')
const B = require('./util/B')

let lastTimeUpdated = 0
let skippedTicks = 0

console.log('Loading i/o features...')
const {
  // binance,
  log,
  socket: io
} = require('./io')

const {
  simpleMarkets,
  simpleBalances
} = require('./store/selectors')
const store = require('./store')

const { thresholds, stateTickInterval, parSec } = require('./util/constants')
const { balanceRatio } = require('./util/constants').hyper

const negotiate = require('./util/negotiate')

store.subscribe(_ => {
  try {
    const state = store.getState()
    // io.emit('state', {
    //   balances: simpleBalances(state),
    //   profits: state.profits,
    //   market: simpleMarkets(state),
    //   skippedTicks
    // })
    // TODO: debounce state emit ?
    const curTime = new Date().getTime()
    if (curTime - lastTimeUpdated >= stateTickInterval) {
      lastTimeUpdated = curTime
      // console.log(`Tick ${curTime} (skipped ${skippedTicks})`)
      io.emit('state', {
        balances: simpleBalances(state),
        profits: state.profits,
        market: simpleMarkets(state),
        skippedTicks
      })
      skippedTicks = 0
    } else {
      skippedTicks += 1
    }
  } catch (error) {
    store.dispatch(error)
  }
})

setInterval(_ => {
  const state = store.getState()

  let arbiter = require('./util/arbitrage')(state)
  const watchOrders = require('./util/watchOrders')

  const arbitrages = state.graph
    .map(geometry => {
      return arbiter(geometry, state.balances[geometry[0]].available * balanceRatio)
    }).filter(a => a && a.ratio && !B(a.ratio).eq(0))

  const mindworthy = arbitrages
    .filter(arb => {
      return arb.ratio && B(arb.ratio).gt(thresholds.log)
    }).sort((a1, a2) => a1.ratio - a2.ratio)// Highest last

  const costworthy = mindworthy
    .filter(arb => B(arb.ratio).gt(B(thresholds.bid)))

  if (!lock.getActive()) {
    if (costworthy.length) {
      const arbitrage = {
        ...costworthy[costworthy.length - 1],
        time: new Date().getTime()
      }

      const key = lock(arbitrage, arbitrage.time)

      if (key) {
        store.dispatch({
          type: 'arbitrage.add',
          arbitrage
        })
        console.info(`Got lock: ${key}`)

        negotiate(arbitrage).catch(e => console.error('BLEHHH', e.body || e))
        // new Promise((resolve) => resolve(arbitrage))
          .then(passThrough(negociated => {
            io.emit('arbitrage', arbitrage)
            log.hard({ ...arbitrage, negociated }) }))
          .then(watchOrders).catch(e => die.error(e.body || e, 'HALAKILI'))
          .then(passThrough(_ => lock.unlock(key)))
          .then(resolvedOrders => {
            console.log(JSON.stringify(resolvedOrders, null, 2), 'Resolved.')

            result = {
              ...arbitrage,
              time: key,
              negociated: resolvedOrders
            }
            io.emit('resolved', result)
            return result
          }).catch(e => die.error('Arbitrage resolution error',e.body || e))
      }
    }
  }
  if (mindworthy.length) {
    io.emit('graph', mindworthy[mindworthy.length - 1])
  }
}, 1000/parSec)
