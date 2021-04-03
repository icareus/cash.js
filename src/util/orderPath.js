const B = require('./B')

const fee = 1 - require('./constants').fee

const { greed } = require('./constants').hyper
const die = require('./die')

const orderPath = ({ balances, market, marketInfo: info }) => (from, to, amount = 1) => {
  const { symbol, side } = market[`${from}${to}`]
    ? { symbol: `${from}${to}`, side: 'sell' }
    : { symbol: `${to}${from}`, side: 'buy' }

  if (!side || !symbol ) { throw(`Invalid path from ${from} to ${to}`) }

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
  // TODO : PR sur B because erreur de merde
  rate = rate.toFixed(pricePrec)

  if (!Number(rate)) {
    return {}
  }

  let baseQty
  if (side == 'sell') {
    baseQty = B(amount).toFixed(volPrec)
  } else {
    baseQty = B(amount).div(rate).toFixed(volPrec)
    if (!Number(baseQty)) {
      // console.log(`Div by zero. ${side} ${amount}${from}, moving ${amount}${from} to ${baseQty}${to} at ${rate}`)
      return {}
    }
    rate = B(amount).div(baseQty).toFixed(pricePrec)
  }

  let quoteQty = B(baseQty).times(rate)

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
    quote: quoteQty,
    cost,
    greed,
    spread,
    scratch,
    priceTick,
    pricePrec,
    mkt,
    notional: quoteQty,
    minNotional,
    ret: B(ret).times(fee).toFixed(side == 'buy' ? info.basePrecision : info.quotePrecision)
  }

  // console.log(`Moving ${amount}${from} to ${to}`)
  // console.log(`${side} ${baseQty} @${rate} (${quoteQty})`)

  return B(quoteQty).gt(minNotional)
    ? path
    : {}
}

module.exports = orderPath
