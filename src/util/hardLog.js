const fs = require('fs')
const path = require('path')

const {
  LOG_DIR: dir = '/dev/null'
} = process.env

const logPath = path.join(dir, 'arbitrage.log')

const log = fs.createWriteStream(logPath, {'flags': 'a'})
const outputLog = str => log.write(str + '\n')

module.exports = outputLog
