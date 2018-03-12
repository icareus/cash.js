const constants = {
  fee: {
    value: 0.1 / 100,
    ratio: 0.999
  },
  hyper: {
    greed: 0.75
  },
  markets: [
    'NEOBNB',
    'BNBUSDT',
    'NEOUSDT',
    'LTCBNB',
    'LTCUSDT'
  ],
  thresholds: {
    high: 1.05,
    mid: 1.0005,
    low: 0.95
  },
  // TODO - Generate all ?
  watch: [
    'USDT NEO BNB'.split(' '),
    'USDT BNB NEO'.split(' '),
    'USDT LTC BNB'.split(' '),
    'USDT BNB LTC'.split(' ')
  ],
  info: {
    'BNBUSDT': {
      'priceFilter': {
        'filterType': 'PRICE_FILTER',
        'minPrice': '0.00010000',
        'maxPrice': '100000.00000000',
        'tickSize': '0.00010000'
      },
      'lotSize': {
        'filterType': 'LOT_SIZE',
        'minQty': '0.01000000',
        'maxQty': '10000000.00000000',
        'stepSize': '0.01000000'
      },
      'minNotional': {
        'filterType': 'MIN_NOTIONAL',
        'minNotional': '10.00000000'
      }
    },
    'NEOUSDT': {
      'priceFilter': {
        'filterType': 'PRICE_FILTER',
        'minPrice': '0.00100000',
        'maxPrice': '10000000.00000000',
        'tickSize': '0.00100000'
      },
      'lotSize': {
        'filterType': 'LOT_SIZE',
        'minQty': '0.00100000',
        'maxQty': '10000000.00000000',
        'stepSize': '0.00100000'
      },
      'minNotional': {
        'filterType': 'MIN_NOTIONAL',
        'minNotional': '10.00000000'
      }
    },
    'NEOBNB': {
      'priceFilter': {
        'filterType': 'PRICE_FILTER',
        'minPrice': '0.00100000',
        'maxPrice': '10000000.00000000',
        'tickSize': '0.00100000'
      },
      'lotSize': {
        'filterType': 'LOT_SIZE',
        'minQty': '0.00100000',
        'maxQty': '10000000.00000000',
        'stepSize': '0.00100000'
      },
      'minNotional': {
        'filterType': 'MIN_NOTIONAL',
        'minNotional': '1.00000000'
      }
    },
    'LTCUSDT': {
      'priceFilter': {
        'filterType': 'PRICE_FILTER',
        'minPrice': '0.01000000',
        'maxPrice': '10000000.00000000',
        'tickSize': '0.01000000'
      },
      'lotSize': {
        'filterType': 'LOT_SIZE',
        'minQty': '0.00001000',
        'maxQty': '10000000.00000000',
        'stepSize': '0.00001000'
      },
      'minNotional': {
        'filterType': 'MIN_NOTIONAL',
        'minNotional': '10.00000000'
      }
    },
    'LTCBNB': {
      'priceFilter': {
        'filterType': 'PRICE_FILTER',
        'minPrice': '0.01000000',
        'maxPrice': '100000.00000000',
        'tickSize': '0.01000000'
      },
      'lotSize': {
        'filterType': 'LOT_SIZE',
        'minQty': '0.00001000',
        'maxQty': '10000000.00000000',
        'stepSize': '0.00001000'
      },
      'minNotional': {
        'filterType': 'MIN_NOTIONAL',
        'minNotional': '1.00000000'
      }
    }
  }

}
// const assets = constants.markets.reduce((assets, symbol) => {
//   const asset = symbol.slice(0, 3)
//   const currency = symbol.slice(3)
//
//   return assets.concat([asset, currency].filter(x => assets.indexOf(x) === -1))
// }, [])
// console.log(assets)

// TODO: Better init & stuff.

module.exports = constants
