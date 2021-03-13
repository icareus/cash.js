let assets = {}

const profitReducer = (profits = {}, update) => {
    if (update.type !== 'update.balances') {
        return profits
    } else {
        const { balances } = update

        ret = Object.keys(balances)
            .filter(token => (Number(balances[token].available) + Number(balances[token].onOrder)))
            .reduce((state, token) => {
                const asset = Number(balances[token].available) + Number(balances[token].onOrder)
                if (!assets[token]) {
                    assets[token] = asset
                }
                return {
                    ...state,
                    [token]: asset - assets[token]
                }
            }, profits)

        return ret
    }
}

module.exports = profitReducer
