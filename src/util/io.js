const fs = require('fs')
const path = require('path')

const serveStatic = (req, res) => {
  const filePath = path.join('static', req.url)
  console.log(filePath.endsWith('/') ? filePath + 'index.html' : filePath)

  const file = fs.createReadStream(filePath.endsWith('/')
  ? filePath + 'index.html' : filePath)

  file.on('error', err => {
    console.error(err)
    res.statusCode = 400
    res.end('Something happened :/')
  })
  file.pipe(res)
}

const noport = (port = 3000) => {
  console.log(`No port provided for WS. Using ${port}`)
  return port
}
const { WS_PORT: port = noport() } = process.env

const srv = require('http').createServer(serveStatic)
const io = require('socket.io')(srv, {
  serveClient: true
})

io.on('connection', client => {
  console.log(`connection: ${client.id} / ${client._id}`)
  client.on('disconnect', _ => console.log(`Disconnection.`))
})

srv.listen(port, _ => console.log(`ws up on port ${port}`))

module.exports = io
