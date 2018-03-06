const express = require('express')
const api = express()

var serveIndex = require('serve-index')
console.log(serveIndex)

api.use('/logs', serveIndex('public/logs', {icons: true}))
api.use(express.static('public'))

module.exports = api
