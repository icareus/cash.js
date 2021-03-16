module.exports = (...msg) => {
  console.log(...msg)
  process.exit(0)
}

module.exports.error  = (...msg) => {
  console.error(...msg)
  process.exit(1)
}