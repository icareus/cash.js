let active = {}

module.exports = what => {
  key = `${new Date().getTime()}`
    active[key] = what || true
    return key
}

module.exports.unlock = key => {
  if (active.key) {
    let ret = active
    delete(active.key)
    return ret
  }
}

module.exports.getActive = _ => Object.keys(active).length && active
