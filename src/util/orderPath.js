const B = require('./B')

const fee = 1 - require('./constants').fee
const info = require('../../exchangeInfo.json')

const { greed } = require('./constants').hyper

const orderPath = ({ balances, market }) => (from, to, amount = 1) => {
  const action = market[to + from]
    ? 'buy'
    : market[from + to]
      ? 'sell'
      : null

  if (!action) { return {} }
  
  const symbol = action == 'buy'
    ? to + from
    : from + to

  const volTick = info[symbol].lotSize.stepSize
  const volPrec = (Number(volTick).toString().split('.')[1] || '').length
  const priceTick = info[symbol].priceFilter.tickSize
  const pricePrec = (Number(priceTick).toString().split('.')[1] || '').length

  const mkt = {
    ask: market[symbol].ask,
    bid: market[symbol].bid
  }
  if (!mkt.bid || !mkt.ask) { return {} }

  // const spread = B(mkt.ask || 0).minus(mkt.bid || 0)
  const spread = B(mkt.ask).minus(mkt.bid)

  const scratch = B(spread).times(greed).toFixed(pricePrec)

  const rate = action == 'buy'
    ? B(mkt.ask).minus(scratch)
    : B(mkt.bid).plus(scratch)

// action == 'sell'
//  ? vol : B(B(amount).div(rate).toFixed(volPrec)).div(fee).times(rate)

  const vol = action == 'sell'
    ? B(amount).toFixed(volPrec)
    : B(amount).div(rate).toFixed(volPrec)

  const cost = action == 'sell'
    ? vol
    : B(amount).toFixed(pricePrec)
  
// const sell = (amount = 1, value) =>
//   B(amount).times(value).times(fee).toFixed(8)

// const buy = (amount, rate) => B(B(amount).div(rate).toFixed(volPrec))
// .times(fee).toFixed(8)
  const buy = (price) => B(cost).div(price).times(fee).round(pricePrec)
  const sell = (value) => B(cost).times(value).times(fee).round(pricePrec)

  const path = {
    amount,
    available: balances[from].available,
    from,
    to,
    symbol,
    action,
    vol,
    at: rate,
    cost,
    greed,
    spread,
    scratch,
    priceTick,
    pricePrec,
    mkt,
    ret: action == 'buy' ? buy(rate) : sell(rate)
  }
  return path
}

module.exports = orderPath
