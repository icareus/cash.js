// const binance = require('./src/io/binance')
// const { markets } = require('./src/util/constants')

// console.log(markets)

// const upperSnake2LowerCamel = str => str.split('_')
//   .map((word, i) => i
//     ? word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
//     : word.toLowerCase())
//   .join('')
//
// const exchangeInfo = new Promise((resolve, reject) =>
//   binance.exchangeInfo((e, infos) => e
//     ? reject(e)
//     : resolve(infos.symbols
//     .reduce((info, symbolInfo) => // console.log(symbolInfo) ||
//     markets.includes(symbolInfo.symbol)
//       ? { ...info,
//         [symbolInfo.symbol]: symbolInfo.filters
//         .reduce((filters, fltr) => ({
//           ...filters,
//           [upperSnake2LowerCamel(fltr.filterType)]: fltr
//         }), {})}
//       : info,
//     {}))
//   )
// )
//
// exchangeInfo
//   .then(x => console.log(JSON.stringify(x)))
//   .catch(console.error)

// const balances = _ => new Promise((resolve, reject) => {
//   binance.balance((error, balances) => error
//     ? reject(error)
//     : resolve(Object.keys(balances)
//       .filter(asset => Number(balances[asset].onOrder) !== 0)
//       .map(k => ({asset: k, ...balances[k]})))
//   )
// })
//
// setInterval(_ => balances().then(balances => {
//   console.clear()
//   console.log(JSON.stringify(balances, null, 2))
// }), 1000)

// let c3 = _ => Math.random() > 9/10
//
// let test = new Promise((resolve, reject) => {
//   let i = setInterval(_ => {
//     let b = c3()
//     b ? (clearInterval(i), resolve(b)) : console.log('B:', b)
//   }, 100)
// })
//
// test.then(console.log)