// const { markets } = require('./constants')
//
// // TODO : This is o(n2) wtf ?! Use market !
// const Pair = (symbols = markets, assets) => assets
//   ? symbols.find(symbol =>
//       assets.reduce((acc, val) => acc && symbol.includes(val), true))
//   : assets => Pair(symbols, assets)
//
// module.exports = Pair
