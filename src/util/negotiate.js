const binance = require('../io/binance')
const store = require('../store')
const B = require('./B')
const die = require('./die')

const BELL = '\u0007'

const order = o => {
  const { action, symbol, vol, at: rate, arbTime, ...stuff } = o
  const ret = new Promise((resolve, reject) => {
    const params = [
      symbol,
      `${Number(vol)}`,
      `${Number(rate)}`,
      {
        type: 'LIMIT',
        // timeInForce: 'FOK'
      }
    ]
    console.log('Order:', JSON.stringify(o, null, 2))
    console.log(`Ordering: ${action}`, {
      symbol,
      vol: Number(vol),
      rate: Number(rate)
    })
    binance[action](...params, (ko, ok) => {
      if (ko) { reject(ko) } else {
        resolve({
          ...ok,
          arbTime
        })
      }
    })
  })

  return ret
}

const negociate = arbitrage => Promise.all(arbitrage.orders
  .map(o => order({
      ...o,
      arbTime: arbitrage.time
    })
  )).catch(e => die(`CAUGHT ! ${e.body || e}`))
  .then(orders => {
    store.dispatch({
      type: 'orders.update',
      orders
    })
    console.log('Negociated:', orders)
    return orders
  }).catch(e => {
    console.error('Negociation error.', e.body || e)
  })


module.exports = negociate
