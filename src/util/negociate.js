const binance = require('../io/binance')
const B = require('./B')
// var quantity = 5, price = 0.00402030;
// binance.buy("BNBETH", quantity, price, {type:'LIMIT'}, (error, response) => {
//   console.log("Limit Buy response", response);
//   console.log("order id: " + response.orderId);
// });

const BELL = '\u0007'

const order = ({ action, symbol, vol, at: rate, ...stuff }) =>
  new Promise((resolve, reject) => {
    const handler = (ko, ok) => ko ? reject(ko) : resolve(ok)

    binance[action](
      symbol, `${B(vol).toFixed(8)}`, `${B(rate).toFixed(8)}`, {type: 'LIMIT'},
      handler
    )
  })

const negociate = arbitrage => {
  global.lock = arbitrage.run.join('->')
  console.log(BELL, JSON.stringify(arbitrage, null, 2))
  return Promise.all(arbitrage.orders.map(o => order(o)
    .catch(e => console.error('Error ordering: ', e.body || e.message))))
}

module.exports = negociate
