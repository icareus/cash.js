console.log('Loading utilities...')
const lock = require('./util/lock')
const passThrough = require('./util/passThrough')
const die = require('./util/die')

console.log('Loading i/o features...')
const {
  binance,
  log,
  socket: io
} = require('./io')

const {
  simpleMarkets,
  simpleBalances
} = require('./store/selectors')
const store = require('./store')

const { thresholds } = require('./util/constants')
const { balanceRatio } = require('./util/constants').hyper

const B = require('./util/B')

const negotiate = require('./util/negotiate')

store.subscribe(_ => {
  const state = store.getState()

  let arbiter = require('./util/arbitrage')(state)
  const watchOrders = require('./util/watchOrders')

  const arbitrages = state.graph
    .map(geometry => {
      return arbiter(geometry, state.balances[geometry[0]].available * balanceRatio)
    })
    .filter(a => {
      return a.ratio && B(a.ratio) != 0
    })
    .sort((a1, a2) => a1.ratio - a2.ratio)// Highest last
  
  if (arbitrages.length) {
    io.emit('graph', arbitrages[arbitrages.length - 1])
  } else {
    // Complain about something ?
  }

  const mindworthy = arbitrages
    .filter(arb => arb.ratio ? B(arb.ratio).gt(B(thresholds.log)) : null)

  const costworthy = mindworthy
    .filter(arb => B(arb.ratio).gt(B(thresholds.bid)))

  if (!lock.getActive()) {
    if (costworthy.length) {
      const arbitrage = costworthy[costworthy.length - 1]
      const key = lock(arbitrage)

      if (key) {
        console.clear()
        console.info(`Got lock: ${key}`)

        negotiate(arbitrage).catch(e => console.error('BLEHHH', e.body || e))
          .then(passThrough(negociated => {
            io.emit('arbitrage', { ...arbitrage, time: key })
            log.hard({ ...arbitrage, time: key, negociated }) }))
          .then(passThrough(console.log))
          .then(watchOrders).catch(e => die.error(e.body || e, 'HALAKILI'))
          .then(passThrough(_ => lock.unlock(key)))
          .then(resolvedOrders => {
            console.log(JSON.stringify(resolvedOrders, null, 2), 'Resolved.')
            // const arbitrage = { ...arbitrage, time: key, orders: resolvedOrders }
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
  } else {
    io.emit('arbitrages', lock.getActive())
  }
  // TODO: debounce state emit
  // console.log('Emit state')
  io.emit('state', {
    balances: simpleBalances(state),
    profits: state.profits,
    market: simpleMarkets(state),
  })
})
