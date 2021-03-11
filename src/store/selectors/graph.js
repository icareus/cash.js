// const fixedTo = require('../../util/fixedTo')
// const { fee } = 1 - require('../../util/constants')
// const { greed } = require('../../util/constants').hyper

const die = require('../../util/die')

// const graph = data => Object.keys(data).reduce(
//   (acc, symbol) => {
//     const asset = symbol.slice(0, 3)
//     const currency = symbol.slice(3)

//     const { bid, ask } = data[symbol]

//     const spread = fixedTo(ask, ask - bid)
//     // hyper 0...1

//     const path = {
//       [asset]: fixedTo(bid, (+bid + (+spread * greed)) * fee),
//       [currency]: fixedTo(ask, (1 / (+ask - spread * greed)) * fee)
//     }
//     return {
//       ...acc,
//       // [symbol]: path
//       [asset]: {
//         ...acc[asset],
//         [currency]: path[asset]
//       },
//       [currency]: {
//         ...acc[currency],
//         [asset]: path[currency]
//       }
//     }
//   }
//   , {})

const graph = ({ balances }) => {
  // Filter out tokens without balance
  const tokens = Object.keys(balances).filter(token => 
    Number(balances[token].available) || Number(balances[token].inOrder)
  )

  // Filter out markets we're not into
  const markets = Object.keys(require('../../../exchangeInfo.json')).filter(symbol => {
    for (tok of tokens) {
      if (symbol.includes(tok)) {
        return tokens.includes(symbol.replace(tok, ''))
      }
    }
  })

  // Generate possible triangles from valid tokens/markets
  // TODO: Do filter here as well
  geometries = tokens.reduce((list, token) => [
    ...list,
    ...tokens.filter(tok => tok != token).reduce((acc, tok, _, toks) => [
      ...acc,
      ...toks.filter(t => t != tok).map(t => [
        token,
        tok,
        t
      ])
    ], [])
  ], []).filter(triangle => {
    // Filter out triangles that aren't possible
    let valid = false
    triangle.forEach((token, index) => {
      valid = markets.includes(''+token+triangle[(index + 1) % 3])
        || markets.includes(''+triangle[(index + 1) % 3]+token)
        ? true
        : false
    })
    return valid
  })

  return {
    tokens,
    markets,
    geometries
  }
}

module.exports = graph
