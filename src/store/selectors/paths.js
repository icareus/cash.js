const fixedTo = require('../../util/fixedTo')
const { ratio: fee } = require('../../util/constants').fee

const paths = data => Object.keys(data).reduce(
  (acc, symbol) => {
    const asset = symbol.slice(0, 3)
    const currency = symbol.slice(3)

    const { bid, ask } = data[symbol]

    const spread = fixedTo(ask, ask - bid)
    // hyper 0...1
    const greed = 0.55

    const path = {
      [asset]: fixedTo(bid, (+bid + (+spread * greed)) * fee),
      [currency]: fixedTo(ask, (1 / (+ask - spread * greed)) * fee)
    }
    return {
      ...acc,
      [symbol]: path
    }
  }
  , {})

module.exports = paths
