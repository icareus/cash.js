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

hardLog(`// LOG_START ${new Date().toISOString()}`)
console.log({ symbols })
console.log({ paths })

binance.websockets.depthCache(symbols, (symbol, depth) => {
  let { bids, asks, E: timeStamp } = depth

  bids = binance.sortBids(bids)
  asks = binance.sortAsks(asks)

  const action = { type: 'update.depth',
    symbol,
    ask: binance.first(asks),
    bid: binance.first(bids),
    asks,
    bids
  }
  console.log(action.type, timeStamp && new Date(timeStamp).toISOString())

  store.dispatch(action)
  io.emit(action)
})

binance.websockets.trades(symbols, (trades) => {
  const { E: timeStamp } = trades
  const action = { type: 'update.trade', trades }

  console.log(action.type, timeStamp && new Date(timeStamp).toISOString())

  store.dispatch(action)
})

let bellInterval = 0

store.subscribe(_ => {
  console.clear()

  const state = store.getState()
  io.volatile.emit('state', require('./store/selectors/simplify')(state))

  console.log(`${new Date().toISOString()}`)
  const currentGraph = graph(state)
  console.log(currentGraph)
  io.emit('graph', currentGraph)

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
    low: 1.001
  }

  const costFn = cost(currentGraph)
  // console.log(currentGraph)
  const arbitrages = paths.reduce((acc, path) => {
    const bell = '\u0007'
    const leverage = costFn(path).toFixed(8)
    const timeStamp = new Date().toISOString()
    const arbitrage = {
      arbitrage: path.join('->'),
      leverage,
      timeStamp
    }
    // TODO: Better logging / bell
    if (+leverage > threshold.high && !bellInterval) {
      console.log(bell)
      hardLog(JSON.stringify(arbitrage, null, 2) + ',')
    } else if (+leverage > threshold.low && +leverage < threshold.high) {
      console.log(arbitrage)
    }

    // return [...acc, arbitrage]
    return leverage > threshold.low
      ? [ ...acc, arbitrage ]
      : acc
  }, [])

  io.emit('arbitrages', arbitrages)
})
