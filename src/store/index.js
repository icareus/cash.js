const { combineReducers, createStore } = require('redux')

const reducers = require('./dux')

module.exports = createStore(combineReducers(reducers))
