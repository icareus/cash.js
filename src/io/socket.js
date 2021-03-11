module.exports = (srv, options = {serveClient: true}) => {
  const io = require('socket.io')(srv, options)

  io.on('connection', client => {
    console.log(`connection: ${client.id}`)
    client.on('disconnect', _ => console.log(`disconnect: ${client.id}`))
  })

  return io
}
