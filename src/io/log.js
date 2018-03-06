const fs = require('fs')
const path = require('path')

const {
  LOG_DIR: dir = '/dev/null'
} = process.env

// console.log(`LOG_DIR: ${path.resolve(path.join(dir))}`)

const data = []

const put = (...logs) => {
  data.push(...logs)
}

const hard = (...logs) => {
  put(logs)
  const dump = JSON.stringify(logs)
  const logPath = path.join(dir, `${new Date().toISOString()}.json`)
  const log = fs.createWriteStream(logPath)
  log.on('end', _ => console.log(`Wrote to ${logPath}`))
  log.end(dump)
}

module.exports = {
  data,
  get: _ => data,
  put,
  hard
}

put({
  start: new Date().toISOString()
})
