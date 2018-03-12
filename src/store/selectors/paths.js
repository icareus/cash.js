const fixedTo = require('../../util/fixedTo')
const { ratio: fee } = require('../../util/constants').fee

const paths = data => Object.keys(data).reduce(
  (acc, symbol) => {
    const asset = symbol.slice(0, 3)
    const currency = symbol.slice(3)
    const { bid, ask } = data[symbol]

    const path = {
      [asset]: fixedTo(bid, bid * fee),
      [currency]: fixedTo(ask, (1 / +ask) * fee)
    }
    return {
      ...acc,
      [symbol]: path
    }
  }
  , {})

module.exports = paths
