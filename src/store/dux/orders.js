const orders = (state = {}, update) => {
    let updatedState = { ...state }

    switch (update.type) {
        case 'orders.updateOne':
            const { order } = update
            console.log(`Orders dux ${update.type}`, JSON.stringify(update, null, 2))
    
            updatedState[order.id] = order
            return updatedState

        case 'orders.add':
            // const { orders } = update
            console.log(`Orders dux ${update.type}`, JSON.stringify(update, null, 2))

            for (o of update.orders) {
                updatedState[o.id] = o
            }
            return updatedState

        case 'orders.update':
            // const { orders } = update
            console.log(`Orders dux ${update.type}`, JSON.stringify(update, null, 2))

            return updatedState
            
        default:
            return state
    }
}

module.exports = orders
