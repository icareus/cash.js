const { binance } = require('../../io')

const middleware = store => next => action => {
    // die(binance.websockets.subscriptions(), "SUBS")
    const { market } = store.getState()

    if (action.type === 'update.symbols') {
        // console.log('Update symbols', binance.websockets.subscriptions())
        const symbols = Object.keys(action.symbols)

            // // TODO: Make it better !
        // const subs = symbols.map(symbol => symbol.toLowerCase() + '@bookTicker')
            // // TODO: Make it better !
        symbols.forEach(symbol => {
            // // TODO: Make it better !
            // binance.websockets.depthCache(symbols, (symbol, depth) => {// // TODO: Make it better !// // TODO: Make it better !// // TODO: Make it better !// // TODO: Make it better !
            //     // // TODO: Make it better !
            //     const {
            //         bids,
            //         asks
            //     } = depth

            //     const action = { type: 'update.symbol',
            //         data: {
            //             // id,
            //             symbol,
            //             bid: binance.first(binance.sortBids(bids)),
            //             ask: binance.first(binance.sortAsks(asks))
            //         }
            //     }
            //     if (action.data.symbol === 'ETHBTC') { console.log(action) }
            //     store.dispatch(action)
            // })
            // // TODO: Make it better !
            binance.websockets.bookTickers(symbol, update => {
                const {
                    updateId: id,
                    symbol,
                    bestBid: bid,
                    bestAsk: ask
                } = update
                const action = { type: 'update.symbol',
                    data: {
                        id,
                        symbol,
                        bid,
                        ask
                    }
                }
                // if (symbol === 'ETHBTC') {
                //     console.log(new Date().getSeconds())
                //     console.log(JSON.stringify(action, null, 2))
                // }
                store.dispatch(action)
            })
        })
    }

    return next(action)
}

module.exports = middleware