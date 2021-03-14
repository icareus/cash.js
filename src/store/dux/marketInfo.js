const marketInfo = (state = {}, update) => {
  if (update.type == 'exchangeInfo') {
    return update.info
  }
  return state
}

module.exports = marketInfo