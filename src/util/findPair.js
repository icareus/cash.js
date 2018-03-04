const { markets } = require('./constants')

const Pair = (symbols = markets, assets) => assets
  ? symbols.find(symbol =>
      assets.reduce((acc, val) => acc && symbol.includes(val), true))
  : assets => Pair(symbols, assets)

module.exports = Pair
