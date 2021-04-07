// const store = require('../store')

const {
  TITLE: title = 'Arbitrage bot'
} = process.env

module.exports = (srv, options = {serveClient: true}) => {
  const io = require('socket.io')(srv, options)

  io.on('connection', client => {
    console.log(`connection: ${client.id}`)
    client.emit(`title`, `${title}${process.env.GREED && ' ('+process.env.GREED+')'}`)
    client.on('disconnect', _ => console.log(`disconnect: ${client.id}`))
  })

  return io
}
