const { binance } = require('../../io')

const middleware = store => next => action => {
    // die(binance.websockets.subscriptions(), "SUBS")
    const { market } = store.getState()

    if (action.type === 'update.symbols') {
        // console.log('Update symbols', binance.websockets.subscriptions())
        const symbols = Object.keys(action.symbols)

        const subs = symbols.map(symbol => symbol.toLowerCase() + '@bookTicker')
        symbols.forEach(symbol => {
            binance.websockets.bookTickers(symbol, update => {
                const {
                    symbol,
                    bestBid: bid,
                    bestAsk: ask
                } = update
                const action = { type: 'update.symbol',
                    data: {
                        symbol,
                        bid,
                        ask
                    }
                }
                store.dispatch(action)
            })
        })
    }

    return next(action)
}

module.exports = middleware