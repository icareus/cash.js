const orders = (state = {}, update) => {
    if (update.type === 'update.order') {
        console.log(JSON.stringify(update, null, 2))
        const { order } = update

        const updatedState = {
            ...state,
            [order.id]: order
        }
        return updatedState
    }
    return state
}

module.exports = orders
