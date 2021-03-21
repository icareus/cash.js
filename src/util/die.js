module.exports = (...msg) => {
  console.log('DIE:', ...msg)
  process.exit(0)
}

module.exports.error  = (...msg) => {
  console.error('DIE ON ERROR:', ...msg)
  process.exit(1)
}