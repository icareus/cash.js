const express = require('express')
const www = express()

www.use(express.static('public'))

module.exports = www
