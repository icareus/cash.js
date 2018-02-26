const fixedTo = require('../../util/fixedTo')

const paths = data => Object.keys(data).reduce(
  (acc, symbol) => {
    const asset = symbol.slice(0, 3)
    const currency = symbol.slice(3)

    const { bid, ask } = data[symbol]

    const spread = fixedTo(ask, +ask - +bid)
    const median = fixedTo(bid, +bid + (+spread / 2))

    const path = {
      // Pessimistic
      // [asset]: fixedTo(bid, +bid * 0.999),
      // [currency]: fixedTo(ask, (1 / +ask) * 0.999)
      // Median
      [asset]: fixedTo(bid, +median * 0.999),
      [currency]: fixedTo(ask, (1 / +median) * 0.999)
      // Optimistic
      // [asset]: fixedTo(ask, +ask * 0.999),
      // [currency]: fixedTo(bid, (1 / +bid) * 0.999)
    }
    // console.log(path[asset] * path[currency])
    return {
      ...acc,
      [symbol]: path
    }
  }
  , {})

module.exports = paths
