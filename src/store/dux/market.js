const B = require('../../util/B')

let sec = null
let secTicks = null

const Symbol = symbol => (state = { symbol }, update) => {
  const {
    bid,
    ask,
    id
  } = update.data
  if (state.id && state.id > id) {
    console.log(`Declined update ${id} on ${symbol}`)
    return state
  }

  const newState = {
    ...state,
    // id,
    ask: ask || state.ask,
    bid: bid || state.bid,
    spread: ask && bid
      ? B(ask).minus(bid)
      : ask - bid
  }
  // if (symbol.symbol == 'ETHBTC') {
  //   currSec = new Date().getSeconds()
  //   if (currSec != sec) {
  //     console.log(`sec ${sec} ticks ${secTicks}`)
  //     sec = currSec
  //     secTicks = 0
  //   }
  //   secTicks += 1
  //   console.log(JSON.stringify(newState, null, 2))
  // }
  return newState
}

const market = (state = {}, update) => {
  if (update.type === 'update.symbols') {
    state = Object.keys(update.symbols).reduce((state, symbol) => {
      const {
        bidPrice: bid,
        askPrice: ask
      } = update.symbols[symbol]
      const spread = B(ask).minus(bid)
      // if (symbol === '') {
        // console.log(`Symbol: ${symbol}, spread: ${spread}`)
      // }
      return ({
        ...state,
        [symbol]: {
          bid,
          ask,
          spread
        }
      })
    }, {})
    return state
  } else if (update.type === 'update.symbol') {
    return {
      ...state,
      [update.data.symbol]: Symbol(update.data)(state[update.data.symbol], update)
    }
  } else {
    return state
  }
}

module.exports = market
