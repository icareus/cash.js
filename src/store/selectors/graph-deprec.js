const die = require('../../util/die')

const graph = ({ balances, markets }) => {
  // Filter out tokens without balance
  const tokens = Object.keys(balances).filter(token => 
    Number(balances[token].available) || Number(balances[token].inOrder)
  )

  // Filter out markets we're not into
  const market = Object.keys(markets).filter(symbol => {
    for (tok of tokens) {
      // console.log('Am I crashening here ?')
      if (symbol.includes(tok)) {
        return tokens.includes(symbol.replace(tok, ''))
      }
    }
  })

  // Generate possible triangles from valid tokens/market
  geometries = tokens.reduce((list, token) => [
    ...list,
    ...tokens.filter(tok => tok !== token).reduce((acc, tok, _, toks) => [
      ...acc,
      ...toks.filter(t => t != tok).map(t => [
        token,
        tok,
        t
      ])
    ], [])
  ], []).filter(triangle => {
    // Filter out triangles that aren't possible
    for (token of triangle) {
      const idx = triangle.indexOf(token)
      const nxt = idx === triangle.length - 1
        ? triangle[0]
        : triangle[idx + 1]

      const s1 = `${token}${nxt}`
      const s2 = `${nxt}${token}`

      mkt = markets[s1] || markets[s2]
      
      if (!mkt) {
        return false
      }

    }
    return true
  })

  return {
    tokens,
    markets: market,
    geometries
  }
}

module.exports = graph
