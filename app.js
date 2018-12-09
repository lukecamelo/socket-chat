const app = require('express')()
const http = require('http').Server(app)

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

http.listen(3000, () => {
  console.log('listening on *:3000')
})
