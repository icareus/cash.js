console.info('Loading env config...')
require('dotenv').config({ path: path.join(__dirname, '.env') })

require('./src')
