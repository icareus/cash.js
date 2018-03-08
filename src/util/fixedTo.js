const B = require('./B')

const fixedTo = (fix, value) => B(value || 0).toFixed(fix
  ? (fix.split('.')[1] || '00000000').length : 8)

module.exports = fixedTo
