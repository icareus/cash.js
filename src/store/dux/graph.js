let tokens = new Set()
let symbols = new Set()

let updated = false

const connected = (t1, t2) => [...symbols]
    .find(symbol => symbol
        .includes(t1) && symbol.replace(t1, '') === t2)

const graph = (state = [], update) => {
    if (update.type === 'update.balances') {
        Object.keys(update.balances)
            .forEach(token => {
                if (!tokens.has(token)) {
                    tokens.add(token)
                    update = true
                }
            })
    } else if (update.type === 'update.symbols') {
        Object.keys(update.symbols)
            .forEach(symbol => {
                if (!symbols.has(symbol)) {
                    symbols.add(symbol)
                    updated = true
                }
            })
    } else if (update.type === 'update.symbol') {
        if (!symbols.has(update.data.symbol)) {
            symbols.add(update.data.symbol)
            updated = true
        }
    }
    if (updated) {
        console.log('Added tokens or symbols. Recomputing graph...')

        const graph = [...tokens].reduce((graph, token) => [
            ...graph,
            ...[...tokens]
                .filter(tok => connected(token, tok)).reduce((acc, tok, _, toks) => [
                    ...acc,
                    ...toks.filter(t => connected(t, tok))
                    .map(t => [
                        token,
                        tok,
                        t
                    ])
                ],[])
        ], [])
        updated = false

        console.log(`Graph computed (${graph.length} triangles.)`)
        for (triangle of graph) {
            triangle.forEach((token, index) => {
                if (!connected(token, triangle[(index + 1) % 3])) {
                    console.error('TRIANGLE ERROR:', triangle)
                    console.error(`${token} not connected to ${triangle[(index + 1) % 3]}`)
                }
            })
        }
        return graph
    }

    return state
}

module.exports = graph
