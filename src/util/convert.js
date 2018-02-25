const convert = (rate, amount = 1, fee = 0.1 / 100) => amount * rate * fee

module.exports = convert
