const B = require('./B')
const orderPath = require('./orderPath')

const arbitrage = (state, run, amount) => {
  const {
    balances,
    // market
  } = state
  if (run && !amount && amount !== 0) {
    amount = Number(balances[run[0]].available) / 1000
  }
  const move = orderPath(state)

  if (!run)
    return (run, amount) => arbitrage(state, run, amount)

  const moves = run.reduce((total, sym, i) => {
    const nxt = run[i + 1] ? run[i + 1] : run[0]
    const { output = amount } = total
    const hop = move(sym, nxt, output)
    return {
      run,
      ...total,
      output: hop.ret || 0,
      orders: [...total.orders, hop],
      profit: total.orders.length && total.orders[0].cost
        && B(hop.ret || 0).minus(total.orders[0].cost),
      ratio: total.orders.length && total.orders[0].cost
        && B(hop.ret || 0).div(total.orders[0].cost)
    }
  }, { orders: [] })

  let overRatio = {
    ratio: null,
    from: null,
    to: null,
    amount: null,
    balances: {
      from: null,
      to: null
    }
  }
  moves.orders.forEach(order => {
    if (order.from && (Number(order.amount) > Number(order.available))) {
      // ratio = Number(balances[order.from].available) / Number(order.amount)
      ratio = Number(order.available) / Number(order.amount)
      overRatio = (overRatio.ratio === null) || (ratio > overRatio.ratio)
        ? {
          ratio,
          from: order.from,
          to: order.to,
          amount,
          balances: {
            from: balances[order.from].available,
            to: balances[order.to].available
          }
        }
        : overRatio
    }
  })

  if (overRatio.ratio === null) {
    return moves
  } else {
    return (arbitrage(state, run, amount * overRatio.ratio * 0.9))
  } 
}

module.exports = arbitrage
