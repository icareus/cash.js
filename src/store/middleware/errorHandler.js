const die = require('../../util/die')
const middleware = store => next => action => {
    if (action instanceof Error) {
        die.error(action)
    }

    return next(action)
}

module.exports = middleware