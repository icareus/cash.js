const balances = (state = {}, action) => {
    return (action.type === 'update.balances'
    ? {
        ...state,
        ...action.balances
    } : state
)}

module.exports = balances
