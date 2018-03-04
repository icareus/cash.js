// module.exports = graph => (acc, path) => {
//   const leverage = costFn(path).toFixed(8)
//   // const timeStamp = new Date().toISOString()
//   const arbitrage = {
//     arbitrage: path.join('->'),
//     leverage,
//     // timeStamp
//     v2: path.reduce((coeffs, asset) => {
//       return {
//         ...coeffs,
//         [asset]: currentGraph[asset]
//       }
//     }, {})
//   }
//   if (+leverage > threshold.high) {
//
//   }
//
//   return [...acc, arbitrage]
// }
