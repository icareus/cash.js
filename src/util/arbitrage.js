const die = require('./die')
const B = require('./B')
const orderPath = require('./orderPath')

const arbitrage = (state, run, amount) => {
  if (!run)
    return (run, amount) => arbitrage(state, run, amount)

  const {
    balances,
    // market
  } = state
  if (run && !amount && amount !== 0) {
    amount = B(balances[run[0]].available).times(0.1)
  } else if (B(amount).gt(balances[run[0]].available)) {
    die.error("Welpp something broke")
  }
  const move = orderPath(state)

  const graph = run.reduce((arbitrage, sym, i) => {
    const nxt = run[i + 1] ? run[i + 1] : run[0]
    const { output = amount } = arbitrage
    const hop = move(sym, nxt, output)
    ret = {
      run,
      input: amount,
      ...arbitrage,
      output: hop.ret || 0,
      orders: [...arbitrage.orders, hop],
      profit: arbitrage.orders.length && Number(arbitrage.orders[0].cost)
        && B(hop.ret || 0).minus(arbitrage.orders[0].cost),
      ratio: arbitrage.orders.length && Number(arbitrage.orders[0].cost)
        && B(hop.ret || 0).div(arbitrage.orders[0].cost)
    }
    // console.log(JSON.stringify(ret, null, 2))
    return ret
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
  graph.orders.forEach(order => {
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
    let pnl = graph.orders.reduce((ratios, order) => ({
      ...ratios,
      [order.from]: B(ratios[order.from] || 0).minus(order.cost || 0),
      [order.to]: B(ratios[order.to] || 0).add(order.ret || 0)
    }), {})
    // return graph
    return {
      pnl,
      ...graph
    }
  } else {
    return (arbitrage(state, run, amount * overRatio.ratio * 0.9))
  } 
}

module.exports = arbitrage
