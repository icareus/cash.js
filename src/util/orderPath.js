const B = require('./B')

const { ratio: fee } = require('./constants').fee
const { info } = require('./constants')

const sell = (amount = 1, value) => // console.log(amount, value) ||
  B(amount).times(value).times(fee).toFixed(8)

const orderPath = market => (from, to, amount = 1) => {
  const bail = market[to + from] && to + from
  const sale = market[from + to] && from + to
  if (!bail && !sale) { return {} }

  const symbol = bail || sale
  const volTick = info[symbol].lotSize.stepSize
  const volPrec = Number(volTick).toString().split('.')[1].length
  const vol = B(amount).toFixed(volPrec)
  const priceTick = info[symbol].priceFilter.tickSize

  const buy = (amount, rate) => B(B(amount).div(rate))
    .add(volTick).times(fee).toFixed(8)

  const mkt = {
    ask: market[symbol].ask,
    bid: market[symbol].bid
  }
  if (!mkt.bid || !mkt.ask) { return {} }

  const spread = B(mkt.ask || 0).minus(mkt.bid || 0)
  const { greed } = require('./constants').hyper
  const scratch = B(Math.floor(spread.div(priceTick).times(greed)))
    .times(priceTick)

  const rate = bail
    ? B(mkt.ask).minus(scratch).toFixed(8)
    : B(mkt.bid).plus(scratch).toFixed(8)

  const path = {
    symbol,
    mkt,
    action: bail ? 'buy' : 'sell',
    at: rate,
    cost: sale ? vol : B(B(amount).div(rate).toFixed(volPrec)).div(fee).times(rate),
    vol: sale ? vol : B(B(amount).div(rate).toFixed(volPrec)),
    ret: bail ? buy(amount, rate) : sell(amount, rate)
  }
  return path
}

module.exports = orderPath
