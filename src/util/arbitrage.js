const orderPath = require('./orderPath')

const arbitrage = (state, run, amount = 1) => {
  const {
    balances,
    market
  } = state
  const move = orderPath(state)

  return run
  ? run.reduce((total, sym, i) => {
    const nxt = run[i + 1] ? run[i + 1] : run[0]
    const { output = amount } = total
    const hop = move(sym, nxt, output)
    return {
      run,
      ...total,
      output: hop.ret || 0,
      orders: [...total.orders, hop]
    }
  }, { orders: [] })
  : (run, amount) => arbitrage(state, run, amount)
}

module.exports = arbitrage
