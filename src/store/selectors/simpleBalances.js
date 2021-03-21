const B = require('../../util/B')

const simpleBalances = ({ balances }) => Object.keys(balances).reduce((wallets, currency) => {
    const total = B(balances[currency].available).add(balances[currency].onOrder)
    return total
    ? { ...wallets,
        [currency]: total
    } : wallets
}, {})

module.exports = simpleBalances
