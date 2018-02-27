const binance = require('./util/binance')
const hardLog = require('./util/hardLog')
const io = require('./util/io')

const {
  findPair
} = require('./util')

const store = require('./store')
const {
  paths: graph
} = require('./store/selectors')

const { markets: symbols } = require('./util/constants')
const { watch: paths } = require('./util/constants')

hardLog(`LOG_START ${new Date().toISOString()}`)
console.log({ symbols })
console.log({ paths })

binance.websockets.depthCache(symbols, (symbol, depth) => {
  let { bids, asks } = depth
  bids = binance.sortBids(bids)
  asks = binance.sortAsks(asks)

  const action = { type: 'update.depth',
    symbol,
    ask: binance.first(asks),
    bid: binance.first(bids),
    asks,
    bids
  }
  // console.log(action)

  store.dispatch(action)
  io.emit(action)
})

binance.websockets.trades(symbols, (trades) => {
  const action = { type: 'update.trade', trades }

  store.dispatch(action)
})

let bellInterval = 0

store.subscribe(_ => {
  console.clear()

  const state = store.getState()
  io.emit('state', require('./store/selectors/simplify')(state))

  console.log(`${new Date().toISOString()}`)
  const currentGraph = graph(state)
  console.log(currentGraph)

  const cost = (currentGraph, run) => run
    ? run.reduce((cost, asset, i) => {
      const nxt = run[i + 1] ? run[i + 1] : run[0]
      const hop = [ asset, nxt ]
      const sym = currentGraph[findPair(currentGraph, hop)]
      const dst = sym ? sym[asset] : 0
      return cost * dst
    }, 1)
    : run => cost(currentGraph, run)

// TODO : DistantMarkets ?
// -> accessible ?
// -> find golden pairs ?
// -> find quadrilaterals w/ remote pairs ? NOTE : Not sure the market has any

  const threshold = {
    high: 1.005,
    low: 1.0001
  }

  const costFn = cost(graph)
  console.log(paths.reduce((acc, arb) => {
    const bell = '\u0007'
    const leverage = costFn(arb).toFixed(8)
    const timeStamp = new Date().toISOString()
    const arbitrage = {
      arbitrage: arb.join('->'),
      leverage,
      timeStamp
    }
    // TODO: Better logging / bell
    if (+leverage > threshold.high && !bellInterval) {
      console.log(bell)
      // bellInterval = setInterval(_ => {
      hardLog(JSON.stringify(arbitrage, null, 2))
      // }, 1000)
    } else if (+leverage < threshold.high) {
      // bellInterval = clearInterval(bellInterval)
    }

    return leverage > threshold.low
      ? [ ...acc, arbitrage ]
      : acc
  }, []))
})
