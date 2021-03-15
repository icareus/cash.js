const binance = require('../io/binance')
const B = require('./B')
const die = require('./die')
// var quantity = 5, price = 0.00402030;
// binance.buy("BNBETH", quantity, price, {type:'LIMIT'}, (error, response) => {
//   console.log("Limit Buy response", response);
//   console.log("order id: " + response.orderId);
// });

const BELL = '\u0007'

const order = ({ action, symbol, vol, at: rate, ...stuff }) =>
  new Promise((resolve, reject) => {
    const handler = (ko, ok) => {
      if (ko) { reject(ko) } else { resolve(ok) }
    }
    const params = [
      symbol,
      `${Number(B(vol))}`,
      `${Number(B(rate))}`,
      {
        type: 'LIMIT',
        // timeInForce: 'FOK'
      }
    ]
    console.log(`Ordering: ${action}`, {
      symbol,
      vol: Number(vol),
      rate: Number(rate)
    })
    binance[action](...params,
      // symbol,
      // `${Number(B(vol))}`,
      // `${Number(B(rate))}`,
      // {type: 'LIMIT'},
      handler
    )
  }).catch(e => console.error(`Order error: ${e.body}`))

const negociate = arbitrage => console.log(BELL, JSON.stringify(arbitrage, null, 2)) ||
  Promise.all(arbitrage.orders
    .map(o => order(o).catch(e => console.error('Error ordering: ', e.body || e.message)))
  ).catch(e => die(`CAUGHT ! ${e.body || e}`))
  .then(nego => {
    console.log('Negociated:', nego)
    return nego
  }).catch(e => {
    console.error('Negociation error.', e.body.msg || e.body || e)
  })


module.exports = negociate
