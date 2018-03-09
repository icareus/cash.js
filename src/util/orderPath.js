const B = require('./B')

const { ratio: fee } = require('./constants').fee

const buy = (sum, cost) => // console.log(sum, cost) ||
  B(sum).div(cost).times(fee).toFixed(8)
const sell = (amount = 1, value) => // console.log(amount, value) ||
  B(amount).times(value).times(fee).toFixed(8)

const orderPath = market => (from, to, amount = 1) => {
  const bail = market[to + from] && to + from
  const sale = market[from + to] && from + to
  if (!bail && !sale) { return {} }

  const symbol = bail || sale
  const mkt = {
    ask: market[symbol].ask,
    bid: market[symbol].bid
  }
  if (!mkt.bid || !mkt.ask) { return {} }

  const spread = B(mkt.ask || 0).minus(mkt.bid || 0)
  const { greed } = require('./constants').hyper
  const scratch = spread.times(greed)
  const rate = bail
    ? B(mkt.ask).minus(scratch)
    : B(mkt.bid).plus(scratch)

  const path = {
    symbol,
    mkt,
    action: bail ? 'buy' : 'sell',
    at: rate,
    vol: amount,
    ret: bail ? buy(amount, rate) : sell(amount, rate)
  }
  return path
}

module.exports = orderPath
