const fs = require('fs')
const path = require('path')
// const die = require('../util/die')

const {
  LOG_DIR: dir = '/dev/null'
} = process.env

if (fs.existsSync(dir)) {
  console.log(`Using log dir ${dir}`)
} else {
  fs.mkdirSync(dir)
    && console.log(`Created log dir ${dir}`)
    || console.error(`Couldn't create log dir.`)
}


const data = []

const put = (...logs) => {
  data.push(...logs)
}

// Defer that side effect tyty <3
const hard = log => new Promise((resolve, reject) => {
  if (!log || !Object.keys(log).length) {
    reject(log)
  } else {
    let logPath = path.join(dir, `${new Date().toISOString()}.json`)
    if (process.platform == 'win32') {
      const rxp = /\:/g
      logPath = logPath.replace(rxp, '.')
    }

    const output = fs.createWriteStream(logPath)

    output.on('end', _ => resolve(log))
    output.on('error', reject)

    output.on('open', _ => {
      output.end(`${JSON.stringify(log, null, 2)}`)
    })
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
