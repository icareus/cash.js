const path = require('path')
require('dotenv').config({ path: path.join(__dirname, '.env') })

const B = require('./src/util/B')

const store = require('./src/store')
const { binance } = require('./src/io')
const { shitcoins } = require('./src/util/constants')

const upperSnake2LowerCamel = str => str.split('_')
  .map((word, i) => i
    ? word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    : word.toLowerCase())
  .join('')

const initExchange = _ => new Promise((resolve, reject) =>
  // Get market structure/format.
  // Reduce to object keyed with symbols, instead of array of stuff
  binance.exchangeInfo((e, infos) => e
    ? reject(e)
    : resolve(infos.symbols
      .reduce((info, { symbol, filters, baseAsset, baseAssetPrecision, quoteAsset, quoteAssetPrecision, quotePrecision }) => ({
        ...info,
        [symbol]: {
          baseAsset,
          baseAssetPrecision,
          quoteAsset,
          quoteAssetPrecision,
          quotePrecision,
          ...filters.reduce(
            (filters, fltr) => ({...filters,
              [upperSnake2LowerCamel(fltr.filterType)]: fltr
            }), {})
        },

      }), {})
    )
  )
).then(info => {
    store.dispatch({
        type: 'exchangeInfo',
        info
    })
    return info
}).catch(e => { throw e })

const initBalances = _ => {
  return new Promise((resolve, reject) => {
    // Initialize balances by getting all assets value
    // Filter out: empty wallets, shitcoins
    binance.balance((error, balances) => {
      if (error) { reject(error) }

      for (token in balances) {
        const available = B(balances[token].available)
                        .add(balances[token].onOrder)
      
        if (available == 0 || shitcoins.includes(token)) {
          delete(balances[token])
        }
      }
      resolve(balances)
    })
  }).then(balances => {
    store.dispatch({ type: 'update.balances',
      balances
    })
    return balances
  }).then(balances => {
    binance.websockets.userData(({ B: updatedBalances }) => {
      const balances = updatedBalances.reduce((balances, balance) => ({
        ...balances,
        [balance.a]: {
          available: balance.f,
          onOrder: balance.l
        }
      }), {})
      const action = { type: 'update.balances',
        balances
      }
      store.dispatch(action)
    })
    
    return balances
  }).then(balances => new Promise((resolve, reject) => {
      binance.bookTickers((error, tickers) => {
        if (error) { reject(error) }

        const tokens = Object.keys(balances)
        const marketData = tickers
          .filter(({ symbol }) => {
            for (token of tokens) {
              if (symbol.includes(token) && tokens.includes(symbol.replace(token, ''))) {
                return true
              }
            }
          })
          .reduce((markets, ticker) => ({
            ...markets,
            [ticker.symbol]: ticker
          }), {})
        resolve(marketData)
      })
    }).then(symbols => store.dispatch({
      type: 'update.symbols',
      symbols
    }))
  )
}

console.log('Fetching exchange info...')
initExchange()
  .then(_ => {
    console.log('Got exchange info.')
    return initBalances() })
  .then(_ => {
    console.log('Got balances.')
  }).then(_ => {
    require('./src')
  })
