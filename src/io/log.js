const fs = require('fs')
const path = require('path')

const {
  LOG_DIR: dir = '/dev/null'
} = process.env

const data = []

const put = (...logs) => {
  data.push(...logs)
}

// Defer that side effect tyty <3
const hard = log => new Promise((resolve, reject) => {
  if (!log || !Object.keys(log).length) {
    reject(log)
  } else {
    const logPath = path.join(dir, `${new Date().toISOString()}.json`)
    const output = fs.createWriteStream(logPath)

    output.on('end', _ => resolve(log))
    output.on('error', reject)

    output.end(JSON.stringify(log))
  }
})

module.exports = {
  data,
  get: _ => data,
  put,
  hard
}

put({
  start: new Date().toISOString()
})
