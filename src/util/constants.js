const constants = {
  fee: {
    value: 0.1 / 100,
    ratio: 0.999
  },
  markets: [
    'LTCETH',
    'LTCBTC',
    'ETHBTC',
    'NEOBNB',
    'NEOBTC',
    'NEOETH',
    'BNBBTC',
    'BNBETH',
    'LTCBNB',
    'LTCUSDT',
    'BTCUSDT'
  ],
  // TODO - Generate these better (this is a shame.)
  // 123, 132
  // 1234, 1243, 1324
  watch: [
    ['LTC', 'BNB', 'ETH'],
    ['LTC', 'BNB', 'ETH'].reverse(),
    ['ETH', 'NEO', 'BNB'],
    ['ETH', 'NEO', 'BNB'].reverse(),
    ['ETH', 'BNB', 'BTC'],
    ['ETH', 'BNB', 'BTC'].reverse(),
    ['BTC', 'ETH', 'LTC'],
    ['BTC', 'ETH', 'LTC'].reverse(),
    ['BNB', 'NEO', 'ETH', 'LTC'],
    ['BNB', 'NEO', 'LTC', 'ETH'],
    ['BNB', 'ETH', 'NEO', 'LTC'],
    'LTC BTC USDT'.split(' '),
    'LTC BTC USDT'.split(' ').reverse(),
    'LTC BTC USDT NEO'.split(' '),
    'LTC BTC USDT NEO'.split(' ').reverse(),
    'LTC BTC NEO USDT'.split(' '),
    'LTC BTC NEO USDT'.split(' ').reverse(),
    'LTC USDT BTC NEO'.split(' '),
    'LTC USDT BTC NEO'.split(' ').reverse()
  ]
}
const assets = constants.markets.reduce((assets, symbol) => {
  const asset = symbol.slice(0, 3)
  const currency = symbol.slice(3)

  return assets.concat([asset, currency].filter(x => assets.indexOf(x) === -1))
}, [])
console.log(assets)

module.exports = constants
