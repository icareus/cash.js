const express = require('express')
const www = express()

if (!process.env.NO_WEBUI) {
    www.use(express.static('public'))
}
www.get('/status', (req, res) => {
    res.json({
        status: 'OK'
    })
})

module.exports = www
