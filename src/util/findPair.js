const Pair = (state, assets) => assets
  ? Object.keys(state).find(symbol =>
      assets.reduce((acc, val) => acc && symbol.includes(val), true))
  : assets => Pair(state, assets)

module.exports = Pair
