const fixedTo = require('../../util/fixedTo')
const { fee } = 1 - require('../../util/constants')
const { greed } = require('../../util/constants').hyper

const graph = data => Object.keys(data).reduce(
  (acc, symbol) => {
    const asset = symbol.slice(0, 3)
    const currency = symbol.slice(3)

    const { bid, ask } = data[symbol]

    const spread = fixedTo(ask, ask - bid)
    // hyper 0...1

    const path = {
      [asset]: fixedTo(bid, (+bid + (+spread * greed)) * fee),
      [currency]: fixedTo(ask, (1 / (+ask - spread * greed)) * fee)
    }
    return {
      ...acc,
      // [symbol]: path
      [asset]: {
        ...acc[asset],
        [currency]: path[asset]
      },
      [currency]: {
        ...acc[currency],
        [asset]: path[currency]
      }
    }
  }
  , {})

module.exports = graph
