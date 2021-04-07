const constants = {
  fee: 0.1 / 100,
  hyper: {
    greed: process.env.GREED || 0.1,
    balanceRatio: process.env.BALANCE_RATIO || 0.2
  },
  thresholds: {
    high: 1.001,
    bid: process.env.THRESHOLD_BID || 1.0001,
    log: process.env.THRESHOLD_LOG || 0.975
  },
  shitcoins: process.env.SHITCOINS
    ? JSON.parse(process.env.SHITCOINS.replace(/\'/g, '"'))
    : []
}

console.log(`Ignoring shitcoins: ${JSON.stringify(constants.shitcoins)}`)
module.exports = constants
// TODO: Better init & stuff.
