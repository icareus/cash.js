module.exports = {
  fee: 0.075 / 100,
  hyper: {
    greed: process.env.GREED || 0.1,
  },
  thresholds: {
    high: 1.001,
    mid: 1.0001,
    low: 0.975
  },
  shitcoins: ['EOP', 'EON', 'ATD', 'ADD', 'MEETONE', 'CLOAK', 'CTR', 'MCO']
}
// TODO: Better init & stuff.
