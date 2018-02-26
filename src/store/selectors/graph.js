// const graph = state => Object.keys(state).reduce((graph, symbol) => {
//   const {
//     ask,
//     bid,
//     asset = symbol.slice(0,3),
//     currency = symbol.slice(3)
//   } = state[symbol]
//
//   return ({
//     ...graph,
//     [symbol]: {
//       [asset]: 0.999 * ask,
//       [currency]: 0.999 * bid
//     }
//   })
// }, {})
//
// module.exports = graph
