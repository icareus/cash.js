const express = require('express')
const api = express()

var serveIndex = require('serve-index')

api.use('/logs', serveIndex('public/logs', {icons: true}))
api.use(express.static('public'))

module.exports = api
