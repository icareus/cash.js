const { combineReducers, createStore, applyMiddleware } = require('redux')

const reducers = require('./dux')
const middleware = require('./middleware')

const store = createStore(combineReducers(reducers), applyMiddleware(...middleware))

module.exports = store
