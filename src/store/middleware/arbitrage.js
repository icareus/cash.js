const arbitrage = require("../../util/arbitrage")

const middleware = store => next => action => {
    if (action.type === 'arbitrage.add') {
        const { arbitrage } = action
        console.log(`${action.type}`, JSON.stringify(arbitrage, null, 2))

        Promise.all(arbitrage.orders.map(order => {
            const orderPromise = new Promise((resolve, reject) => {
                console.log(`OrderPromise ${order.arbTime} - new order should dispatch here`)

                setTimeout(_ => {
                    console.log(`In timeout of orderPromise ${order.arbTime}`)

                    resolve(order)
                }, Math.random() * 500)
            }).catch(store.dispatch)

            return orderPromise
        })).then(orders => store.dispatch({
            type: 'orders.add',
            orders
        }))
    }
    next(action)
}

module.exports = middleware