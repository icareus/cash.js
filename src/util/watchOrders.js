const binance = require('../io/binance')
const die = require('./die')
// const passThrough = require('./passThrough')

const checkOrder = order => new Promise((resolve, reject) => {
  const {
    orderId,
    symbol
  } = order

  return binance.orderStatus(symbol, orderId, (error, status) => error
    ? reject({ ...order, status: error.body })
    : resolve(status))
})

const watchOrders = orders => new Promise((resolve, reject) => {
  const i = setInterval(_ => {
    Promise.all(orders.map(o => checkOrder(o).catch(e => die('Error ordering :', e))))
      .catch(e => die(e, 'SEPPUKU'))
      .then(results => {
        const filled = results.filter(order => order.status === 'FILLED')
        const expired = results.filter(order => order.status === 'EXPIRED')
        const canceled = results.filter(order => order.status === 'CANCELED')
        if (filled.length + expired.length + canceled.length === orders.length) {
          clearInterval(i)
          resolve(orders)
        } else if (results.filter(order => order.status === 'ERROR').length) {
          reject(orders)
        }
      })
  }, 5000)
})

module.exports = watchOrders
