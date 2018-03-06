const findPair = require('./findPair')
const { markets: pairs } = require('./constants')
// TODO: use this.
// const fixedTo = require('./fixedTo')

// Given a graph, compute cost / return from a run thru values
const arbitrage = (graph, run, amount = 1) => {
  // console.log('arb', run, amount)
  return run
  ? run.reduce((arbitrage, sym, i) => {
    const nxt = run[i + 1] ? run[i + 1] : run[0]
    const { output = '1.00000000' } = arbitrage
    return {
      ...arbitrage,
      output: output * graph[sym][nxt],
      [sym]: {
        pair: findPair(pairs, [sym, nxt]),
        from: sym,
        to: nxt,
        vol: arbitrage.output,
        ret: output * graph[sym][nxt]
      }
    }
  }, { run })
  : (run, amount) => arbitrage(graph, run, amount)
}
module.exports = arbitrage
