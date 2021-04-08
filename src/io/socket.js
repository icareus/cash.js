// const store = require('../store')
const { getActive } = require('../util/lock')

const {
  TITLE: title = 'Arbitrage bot'
} = process.env

module.exports = (srv, options = {serveClient: true}) => {
  const io = require('socket.io')(srv, options)

  io.on('connection', client => {
    const arbitrages = getActive()
    console.log(`connection: ${client.id}`)
    client.emit(`title`, `${title}${process.env.GREED && ' ('+process.env.GREED+')'}`)
    if (Object.keys(arbitrages).length) {
      client.emit('arbitrages', getActive())
    }
    client.on('disconnect', _ => console.log(`disconnect: ${client.id}`))
  })

  return io
}
