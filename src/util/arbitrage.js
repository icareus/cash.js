const orderPath = require('./orderPath')

const arbitrage = (market, run, amount = 1) => {
  const move = orderPath(market)

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
  : (run, amount) => arbitrage(market, run, amount)
}

module.exports = arbitrage
