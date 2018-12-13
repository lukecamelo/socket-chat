const app = require('express')()
const http = require('http').Server(app)
const io = require('socket.io')(http)

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  )
  next()
})

app.get('/', (req, res) => {
  res.json({ message: 'hello from express!' })
})

let user,
  connectedUsers = []

io.on('connection', socket => {
  console.log('a user connected!')
  console.log(Object.keys(io.sockets.sockets).length)
  // clients = Object.keys(io.sockets.sockets).length

  io.sockets.emit('new_user', {
    message: 'user connected!',
    clients: connectedUsers
  })

  socket.on('disconnect', () => {
    console.log('a user has disconnected')
    clients = Object.keys(io.sockets.sockets).length
    console.log(Object.keys(io.sockets.sockets).length)

    io.sockets.emit('disconnect', {
      message: 'user disconnected!',
      clients: connectedUsers
    })
  })

  socket.on('chat message', data => {
    console.log('message: ' + data.message)
  })

  socket.on('chat message', data => {
    io.sockets.emit('chat message', {
      message: data.message,
      username: user
    })
  })

  socket.on('username change', data => {
    connectedUsers.push(data.username)
    console.log('connected: ', connectedUsers)
    user = data.username

    io.sockets.emit('add_user', {
      connectedUsers
    })
  })

  socket.on('user_typing', data => {
    // when it receives the typing data, send it back (necessary ???)
    io.sockets.emit('user_typing', {
      user: data.user,
      typing: data.typing
    })
  })
})

http.listen(3000, () => {
  console.log('listening on *:3000')
})
