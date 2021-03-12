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

const {
  simpleMarkets,
  simpleBalances
} = require('./store/selectors')
const store = require('./store')

console.log(`Initializing values...`)
const {
  // watchlist: graph,
  // markets: symbols,
  thresholds
} = require('./util/constants')

const B = require('./util/B')

let graph = { ready: false }

// binance.bookTickers((error, ticker) => {
//   if (error) {
//     console.error(error)
//   } else {
//     store.dispatch({ type: 'update.symbols',
//       symbols: ticker
//     })

//     graph.ready = graph.ready === 'balances'
//       ? true
//       : 'ticker'

//     binance.websockets.depthCache(symbols, (symbol, depth) => {
//       let { bids, asks } = depth

//       bids = binance.sortBids(bids)
//       asks = binance.sortAsks(asks)

//       const action = { type: 'update.symbol',
//         symbol,
//         ask: binance.first(asks),
//         bid: binance.first(bids),
//         asks,
//         bids
//       }

//       store.dispatch(action)
//       io.emit(action)
//     })
//   }
// })

console.log('Initialize balances...')
binance.balance((error, balances) => {
  if ( error ) {
    console.error(error)
  } else {
    console.log('Got balances')
    const action = { type: 'update.balances',
      balances
    }    
    graph.ready = graph.ready === 'ticker'
      ? true
      : 'balances'
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

const negotiate = require('./util/negotiate')

store.subscribe(_ => {
  const state = store.getState()

  if (!graph.geometries) {
    if (graph.ready) {
      console.warn('Building graph...')
      graph = require('./store/selectors/graph')(state)
      console.warn('Done.')
      binance.bookTickers((error, ticker) => {
        console.log('Initialize markets...')
        if (error) {
          console.error(error)
        } else {
          store.dispatch({ type: 'update.symbols',
            symbols: ticker.filter(ticker => graph.markets.includes(ticker.symbol))
          })
          binance.websockets.depthCache(graph.markets, (symbol, depth) => {
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
        }
      })
    } else { return }
  }

  const arbiter = require('./util/arbitrage')(state)
  const watchOrders = require('./util/watchOrders')

  const arbitrages = graph.geometries
    .map(geometry => {
      // console.log(geometry.map(token => ({ token, balance: state.balances[token].available })), arbiter(geometry, state.balances[geometry[0]].available))
      return arbiter(geometry, state.balances[geometry[0]].available)
    })
    .filter(a => a.ratio)
    .sort((a1, a2) => a1.ratio - a2.ratio)// Highest last
  
  if (arbitrages.length) {
    io.emit('graph', arbitrages[arbitrages.length - 1])
  } else {
    // Complain about something ?
  }

  const mindworthy = arbitrages
    .filter(arb => arb.ratio ? B(arb.ratio).gt(B(thresholds.low)) : null)

  const costworthy = mindworthy
    .filter(arb => B(arb.ratio).gt(B(thresholds.mid)))

  if (!lock.getActive()) {
    if (costworthy.length) {
      const arbitrage = costworthy[costworthy.length - 1]
      log.hard(arbitrage)
      // io.emit('graph', arbitrage)
      const key = lock(arbitrage)

      if (key) {
        console.clear()
        console.info(`Got lock: ${key}`)

        negotiate(arbitrage)
          .then(passThrough(log.hard)).catch(console.error)
          .then(passThrough(x => console.log(JSON.stringify(x, null, 2))))
          .then(watchOrders).catch(die)
          .then(passThrough(_ => lock.unlock(key)))
          .then(passThrough(r => {
            console.log(JSON.stringify(r, null, 2), 'Resolved.')
            io.emit('resolve', { ...arbitrage, time: key })
          }))
      }
    } else if (mindworthy.length) {
      // io.emit('graph', mindworthy[mindworthy.length - 1])
    }// else { io.emit('graph', arbitrages[arbitrages.length - 1]) }
  } else {
    io.emit('arbitrages', lock.getActive())
  }
  io.emit('state', {
    balances: simpleBalances(state),
    market: simpleMarkets(state)
  })
})
