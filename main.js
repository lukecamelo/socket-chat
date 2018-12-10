const button = document.querySelector('#button')
const input = document.querySelector('#chat-input')
const username = document.querySelector('#username')
const chatroom = document.querySelector('#chatroom')
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
  socket.emit('chat message', {
    message: input.value,
    username: username.value
  })
  input.value = ''
  return false
})

socket.on('chat message', data => {
  console.log(data)
  let p = document.createElement('p')
  p.innerHTML = `<p class='message'>${data.username}: ${data.message}</p>`
  chatroom.appendChild(p)
})
