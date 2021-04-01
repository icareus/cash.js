const B = require('./B')

const fee = 1 - require('./constants').fee

const { greed } = require('./constants').hyper
const die = require('./die')

const orderPath = ({ balances, market, marketInfo: info }) => (from, to, amount = 1) => {
  console.log('In OrderPath')
  const { symbol, side } = market[`${from}${to}`]
    ? { symbol: `${from}${to}`, side: 'sell' }
    : { symbol: `${to}${from}`, side: 'buy' }

  if (!side || !symbol ) { throw(`Invalid path from ${from} to ${to}`) }

  // console.log(symbol, info[symbol], 'In orderPath')
  const volTick = info[symbol].lotSize.stepSize
  const volPrec = (Number(volTick).toString().split('.')[1] || '').length
  const priceTick = info[symbol].priceFilter.tickSize
  const pricePrec = (Number(priceTick).toString().split('.')[1] || '').length

  const mkt = {
    ask: market[symbol].ask,
    bid: market[symbol].bid
  }
  if (!mkt.bid || !mkt.ask) {
    die(`No bid or ask for ${mkt}`)
    console.log('Return chibré')
    return {}
  }

  const spread = B(mkt.ask).minus(mkt.bid)

  let scratch = B(spread).times(greed)

  let rate
  if (side == 'buy') {
    rate = B(mkt.ask).minus(scratch)
  } else {
    rate = B(mkt.ask).plus(scratch)
  }
  rate = rate.toFixed(priceTick)

  if (!Number(rate)) {
    console.log('Second return')
    return {}
  }

  let baseQty
  if (side == 'sell') {
    baseQty = B(amount).toFixed(volPrec)
  } else {
    baseQty = B(amount).times(rate).toFixed(volPrec)
    rate = B(amount).div(baseQty)
  }

  let quoteQty = baseQty.times(rate)

  // the actual amount we're moving (real input)
  const cost = side == 'sell'
    ? baseQty
    : quoteQty

  // The actual amount we're receiving (real output)
  const ret = side == 'buy'
    ? baseQty
    : quoteQty

  const minNotional = info[symbol].minNotional.minNotional

  const path = {
    amount,
    available: balances[from].available,
    from,
    to,
    symbol,
    action: side,
    vol: baseQty,
    at: rate,
    cost: side == 'sell' ? baseQty : quoteQty,
    greed,
    spread,
    scratch,
    priceTick,
    pricePrec,
    mkt,
    notional: quoteQty,
    minNotional,
    ret
  }

  console.log('OrderPath end')
  return B(quoteQty).gt(minNotional)
    ? path
    : {}
}

module.exports = orderPath
