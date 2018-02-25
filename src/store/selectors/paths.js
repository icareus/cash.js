const fixedTo = require('../../util/fixedTO')

const paths = data => Object.keys(data).reduce(
  (acc, symbol) => {
    const asset = symbol.slice(0, 3)
    const currency = symbol.slice(3)

    const { bid, ask } = data[symbol]

    const path = {
      [asset]: fixedTo(bid, +bid * 0.999),
      [currency]: fixedTo(ask, 1 / +ask * 0.999)
    }
    return {
      ...acc,
      [symbol]: path
    }
  }
  , {})

module.exports = paths
