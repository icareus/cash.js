const B = require('big.js')

// Decimal Precision: 8 (cryptos standard)
// Rounding Mode : towards 0 (trunc)
B.DP = 8
B.NE = -8
B.RM = 0
B.strict = true

module.exports = B
