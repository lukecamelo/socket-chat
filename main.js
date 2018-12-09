const button = document.querySelector('#button')
const input = document.querySelector('#chat-input')
const socket = io.connect('http://localhost:3000')

const getMessage = () => {
  fetch('http://localhost:3000/', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(res => res.json())
    .then(res => console.log(res))
}

button.addEventListener('click', () => {
  socket.emit('chat message', input.value)
  input.value = ''
  return false
})
