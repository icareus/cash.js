const binance = require('./util/binance')
const hardLog = require('./util/hardLog')
const {
  fixedTo,
  findPair
} = require('./util')

const store = require('./store')
const {
  paths,
  simplify
} = require('./store/selectors')

const symbols = [
  'LTCETH', 'LTCBTC', 'LTCBNB',
  'ETHBTC', 'BNBETH', 'BNBBTC',
  'NEOBNB', 'NEOBTC', 'NEOETH'
]

hardLog(`LOG_START ${new Date().toISOString()}`)

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
})

binance.websockets.trades(symbols, (trades) => {
  store.dispatch({ type: 'update.trade', trades })
})

// const neighbors = (graph, asset) => asset
//   ? Object.keys(graph)
//     .filter(pair => graph[pair][asset])
//     .reduce((neighbors, pair) => ({ ...neighbors, [pair]: graph[pair][asset] }), {})
//   : asset => neighbors(graph, asset)

store.subscribe(_ => {
  const state = store.getState()
  console.log(`${new Date().toISOString()}`)
  // const data = simplify(store.getState())
  // console.log(data)
  const graph = paths(state)
  console.log(graph)
  //
  const cost = (graph, run) => run
    ? run.reduce((cost, asset, i) => {
      const nxt = run[i + 1] ? run[i + 1] : run[0]
      const hop = [ asset, nxt ]
      const sym = graph[findPair(graph, hop)]
      const dst = sym ? sym[asset] : 0
      return cost * dst
    }, 1)
    : run => cost(graph, run)

// TODO : DistantMarkets ?
// -> accessible ?
// -> find golden pairs ?

  const arbitrages = [
    ['ETH', 'NEO', 'BNB'],
    ['ETH', 'NEO', 'BNB'].reverse(),
    ['BNB', 'NEO', 'ETH', 'LTC'],
    ['BNB', 'NEO', 'ETH', 'LTC'].reverse(),
    ['BTC', 'ETH', 'LTC'],
    ['BTC', 'ETH', 'LTC'].reverse(),
  ]
  const costFn = cost(graph)
  console.log(arbitrages.reduce((acc, arb) => [
    ...acc, costFn(arb)], []))
})
