const redux = require('redux')

const market = require('./dux')

module.exports = redux.createStore(market)
