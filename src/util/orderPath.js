const B = require('./B')

const fee = 1 - require('./constants').fee

const { greed } = require('./constants').hyper
const die = require('./die')

const orderPath = ({ balances, market, info }) => (from, to, amount = 1) => {
  const { symbol, action } = market[`${from}${to}`]
    ? { symbol: `${from}${to}`, action: 'sell' }
    : { symbol: `${to}${from}`, action: 'buy' }

  if (!action || !symbol ) { throw(`Invalid path from ${from} to ${to}`) }

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

  // Scratch = slippage
  // Note: Spread.abs() in case there's no ask / bid at all
  let scratch = B(spread).abs().times(greed).toFixed(pricePrec)
  if (B(scratch).gt(mkt.ask) || B(scratch).gt(mkt.bid)) {
    scratch = B(spread).abs().div(greed)
  }

  // The actual price going into the order
  let rate = action == 'buy'
    ? B(mkt.ask).minus(scratch)
    : B(mkt.bid).plus(scratch)

  if (!Number(rate)) {
    // die(`No rate: ${JSON.stringify({
    //   symbol,
    //   mkt,
    //   rate,
    //   scratch,
    //   greed,
    // }, null, 2)}`)
    return {}
  }

  // The quantity we're actually ordering
  const vol = action == 'sell'
    ? B(amount).toFixed(volPrec)
    : B(amount).div(rate).toFixed(volPrec)

  // the actual amount we're moving (real input)
  const cost = action == 'sell'
    ? vol
    : B(amount).toFixed(pricePrec)

  // The actual amount we're receivint (real output)
  const ret = action == 'buy'
    ? B(cost).div(rate).times(fee).toFixed(volPrec)
    : B(vol).times(rate).times(fee).toFixed(pricePrec)

  const notional = B(vol).times(rate)
  const minNotional = info[symbol].minNotional.minNotional

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
    notional,
    minNotional,
    ret
  }


  // return B(path.ret).gt(B(info[symbol].minNotional.minNotional))
  return B(notional).gt(B(minNotional))
    ? path
    : {}
}

module.exports = orderPath
