const arbitrage = require('./arbitrage')
const tickerSubscriber = require('./tickerSubscriber')
const errorHandler = require('./errorHandler')

module.exports = [
    arbitrage,
    tickerSubscriber,
    errorHandler
]