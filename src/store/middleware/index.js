const tickerSubscriber = require('./tickerSubscriber')
const errorHandler = require('./errorHandler')

module.exports = [
    tickerSubscriber,
    errorHandler
]