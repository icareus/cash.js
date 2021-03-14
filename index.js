console.info('Loading env config...')
require('dotenv').config()

const fs = require('fs').promises

const binance = require('./src/io/binance')

const upperSnake2LowerCamel = str => str.split('_')
  .map((word, i) => i
    ? word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    : word.toLowerCase())
  .join('')

const exchangeInfo = new Promise((resolve, reject) =>
  binance.exchangeInfo((e, infos) => e
    ? reject(e)
    : resolve(infos.symbols
      .reduce((info, symbolInfo) => ({
        ...info,
        [symbolInfo.symbol]: symbolInfo.filters
          .reduce((filters, fltr) => ({
            ...filters,
            [upperSnake2LowerCamel(fltr.filterType)]: fltr
          }), {})
      }), {})
    )
  )
)

exchangeInfo
  .then(x => JSON.stringify(x, null, 2))
  .then(json => fs.writeFile('exchangeInfo.json', json))
  .then(console.log('Wrote exchangeInfo.json'))
  .catch(e => { throw e })
  .then( require('./src') )
