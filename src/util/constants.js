const constants = {
  fee: {
    value: 0.1 / 100,
    ratio: 0.999
  },
  hyper: {
    greed: 0.9
  },
  markets: [
    'LTCETH',
    // 'LTCBTC',
    // 'ETHBTC',
    'NEOBNB',
    // 'NEOBTC',
    'NEOETH',
    // 'BNBBTC',
    'BNBETH',
    'LTCBNB',
    'LTCUSDT',
    'NEOUSDT',
    'ETHUSDT',
    'BNBUSDT'// ,
    // 'BCCUSDT',
    // 'BTCUSDT'
  ],
  thresholds: {
    high: 1.005,
    mid: 1.001,
    low: 0.999
  },
  // TODO - Generate these better (this is a shame.)
  watch: [
    // ['LTC', 'BNB', 'ETH'],
    // ['LTC', 'BNB', 'ETH'].reverse(),
    // ['ETH', 'NEO', 'BNB'],
    // ['ETH', 'NEO', 'BNB'].reverse(),
    // ['ETH', 'BNB', 'BTC'],
    // ['ETH', 'BNB', 'BTC'].reverse(),
    // ['BTC', 'ETH', 'LTC'],
    // ['BTC', 'ETH', 'LTC'].reverse(),
    // ['BNB', 'NEO', 'ETH', 'LTC'],
    // ['BNB', 'NEO', 'ETH', 'LTC'].reverse(),
    // 'LTC BTC USDT'.split(' '),
    // 'LTC BTC USDT'.split(' ').reverse(),
    'BNB USDT LTC'.split(' '), // Grow BNB
    'USDT BNB LTC'.split(' '), // Grow USDT
    // 'LTC BNB NEO'.split(' '),
    // 'LTC BNB NEO'.split(' ').reverse(),
    // 'LTC BTC USDT NEO'.split(' '),
    // 'LTC BTC USDT NEO'.split(' ').reverse(),
    // 'LTC BTC NEO USDT'.split(' '),
    // 'LTC BTC NEO USDT'.split(' ').reverse(),
    'NEO BNB USDT'.split(' '), // Grow NEO (and make moar GAS)
    'NEO USDT BNB'.split(' ') // Grow NEO (and make moar GAS)
  ]
}
const assets = constants.markets.reduce((assets, symbol) => {
  const asset = symbol.slice(0, 3)
  const currency = symbol.slice(3)

  return assets.concat([asset, currency].filter(x => assets.indexOf(x) === -1))
}, [])
console.log(assets)

// // TODO : Make this work ? -> Note, generatorics removed from deps.
// const G = require('generatorics')
// const paths = []
// for (let path of G.clone.combination(assets, 3)) {
//   paths.push(path)
//
//   console.log('PATH HERE ---')
//   console.log(path)
//   console.log('END PATH HERE ---')
// }
//
// constants.watch = paths

module.exports = constants
