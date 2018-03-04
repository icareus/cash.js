const findPair = require('./findPair')
const { markets: pairs } = require('./constants')

// const fixedTo = require('../../util/fixedTo')
// const { ratio: fee } = require('../../util/constants').fee

// const paths = data => Object.keys(data).reduce(
//   (acc, symbol) => {
//     const asset = symbol.slice(0, 3)
//     const currency = symbol.slice(3)

//     const { bid, ask } = data[symbol]

//     const spread = fixedTo(ask, ask - bid)
//     // hyper 0...1
//     const greed = 1
//
//     const path = {
//       [asset]: fixedTo(bid, (+bid + (+spread * greed)) * fee),
//       [currency]: fixedTo(ask, (1 / (+ask - spread * greed)) * fee)
//     }
//     return {
//       ...acc,
//       [symbol]: path
//     }
//   }
//   , {})

// module.exports = paths

// Given a graph, compute cost / return from a run thru values
const cost = (currentPaths, run) => {
  return run
  ? run.reduce((cost, asset, i) => {
    const nxt = run[i + 1] ? run[i + 1] : run[0]
    const hop = [ asset, nxt ]
    const sym = currentPaths[findPair(pairs, hop)]
    const dst = sym ? sym[asset] : 0
    return cost * dst
  }, 1)
  : run => cost(currentPaths, run)
}
module.exports = cost
