let active = {}

const lock = (what, key) => {
  key = key || `${new Date().getTime()}`
    active[key] = what || true
    return key
}

lock.unlock = key => {
  if (active[key]) {
    let ret = active
    delete(active[key])
    return ret
  }
}

lock.getActive = _ => Object.keys(active).length && active

module.exports = lock
