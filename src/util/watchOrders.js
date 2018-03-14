const binance = require('../io/binance')
// const passThrough = require('./passThrough')

// var quantity = 5, price = 0.00402030;
// binance.buy("BNBETH", quantity, price, {type:'LIMIT'}, (error, response) => {
//   console.log("Limit Buy response", response);
//   console.log("order id: " + response.orderId);
// });
// binance.orderStatus("ETHBTC", orderid, (error, orderStatus, symbol) => {
//   console.log(symbol+" order status:", orderStatus);
// });
const testOrders = [
  { symbol: 'NEOUSDT',
    orderId: 19314878,
    clientOrderId: 'CloUbD3xcnR23loZArDVy1',
    transactTime: 1520957745654,
    price: '80.92800000',
    origQty: '0.14800000',
    executedQty: '0.00000000',
    status: 'NEW',
    timeInForce: 'GTC',
    type: 'LIMIT',
    side: 'BUY' },
  { symbol: 'NEOBNB',
    orderId: 7442423,
    clientOrderId: '2vMP2L9ZGwsccrtsic4eRR',
    transactTime: 1520957745647,
    price: '8.46900000',
    origQty: '0.14700000',
    executedQty: '0.00000000',
    status: 'NEW',
    timeInForce: 'GTC',
    type: 'LIMIT',
    side: 'SELL' },
  { symbol: 'BNBUSDT',
    orderId: 15385841,
    clientOrderId: 'yjj4t8DVQtoZ3dR2bBJ05F',
    transactTime: 1520957745647,
    price: '9.65080000',
    origQty: '1.25000000',
    executedQty: '0.00000000',
    status: 'NEW',
    timeInForce: 'GTC',
    type: 'LIMIT',
    side: 'SELL' } ]

const checkOrder = order => new Promise((resolve, reject) => {
  const {
    orderId,
    symbol
  } = order

  return binance.orderStatus(symbol, orderId, (error, status) => error
    ? reject(error)
    : resolve(status))
})

const watchOrders = orders => new Promise((resolve, reject) => {
  if (require('./constants').test) { orders = testOrders }

  const i = setInterval(_ => {
    Promise.all(orders.map(checkOrder))
      .catch(console.error)
      .then(results => {
        let filled = results.filter(order => order.status === 'FILLED')
        if (filled.length === orders.length) {
          clearInterval(i)
          resolve(orders)
        }
      })
      // .catch(console.error)
  }, 1000)
})

module.exports = watchOrders
