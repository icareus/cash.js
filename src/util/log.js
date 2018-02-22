const fs = require('fs')

const log = fs.createWriteStream('/tmp/arbitrage.log')
const outputLog = str => log.write(str + '\n')

module.exports = outputLog
