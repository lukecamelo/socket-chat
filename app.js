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

let user

io.on('connection', socket => {
  console.log('a user connected!')
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
    console.log('username change data: ', data)
    user = data.username
    console.log(user)
  })

  socket.on('user_typing', data => {
    console.log('typing socket ', data)
    io.sockets.emit('user_typing', {
      user,
      typing: data
    })
  })
})

http.listen(3000, () => {
  console.log('listening on *:3000')
})
