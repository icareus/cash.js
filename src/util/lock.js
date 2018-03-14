// const util = require('util')
let active = null
let key = null

module.exports = what => {
  if (!active) {
    active = what || true
    key = `${new Date().toISOString()}`
    return key
  }
}

module.exports.unlock = k => {
  if (k === key) {
    let ret = active
    active = null
    key = null
    return ret
  }
}

module.exports.getActive = _ => active
