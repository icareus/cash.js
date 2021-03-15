module.exports = {
  fee: 0.075 / 100,
  hyper: {
    greed: process.env.GREED || 0.1,
    balanceRatio: process.env.BALANCE_RATIO || 0.2
  },
  thresholds: {
    high: 1.001,
    bid: process.env.THRESHOLD_BID || 1.0001,
    log: process.env.THRESHOLD_LOG || 0.975
  },
  shitcoins: ['EOP', 'EON', 'ATD', 'ADD', 'MEETONE', 'CLOAK', 'CTR', 'MCO']
}
// TODO: Better init & stuff.
