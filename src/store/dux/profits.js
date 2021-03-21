const B = require('../../util/B')

let assets = {}

const profitReducer = (profits = {}, update) => {
    if (update.type !== 'update.balances') {
        return profits
    } else {
        const { balances } = update

        ret = Object.keys(balances)
            .filter(token => B(balances[token].available)
                            .add(balances[token].onOrder)
                            .gt(0))
            .reduce((state, token) => {
                const asset = B(balances[token].available)
                            .add(balances[token].onOrder)
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
