const fixedTo = (fix, value) => value.toFixed(fix
  ? fix.split('.')[1].length : 1)

module.exports = fixedTo
