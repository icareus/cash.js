const simpleBalances = ({ balances }) => Object.keys(balances).reduce((wallets, currency) => {
    const total = Number(balances[currency].available) + Number(balances[currency].onOrder)
    return total
    ? { ...wallets,
        [currency]: total
    } : wallets
}, {})

module.exports = simpleBalances