const button = document.querySelector('#button')
const input = document.querySelector('#chat-input')
const usernameForm = document.querySelector('#username-form')
const chatroom = document.querySelector('#chatroom')
const messageContainer = document.querySelector('.message-container')
const typingTag = document.querySelector('#typing')
const socket = io.connect('http://localhost:3000')

let username

// Will soon be removed to make way for a proper input form
button.addEventListener('click', () => {
  socket.emit('chat message', {
    message: input.value,
    username: username.value
  })
  input.value = ''
  return false
})

// Builds a p tag containg the message data
socket.on('chat message', data => {
  console.log(data)
  let p = document.createElement('p')
  p.classList.add('message')
  p.innerHTML = `${data.username}: ${data.message}`
  messageContainer.appendChild(p)
})

// Temporary measure to have loosie goosie usernames
usernameForm.addEventListener('submit', e => {
  e.preventDefault()
  username = [...usernameForm.getElementsByTagName('input')][0].value
  console.log(username)
  socket.emit('username change', {
    username
  })
})

/* v TYPING STUFF v */

let typing, timeout

// returns typing variable to false shortly after user stops typing
function timeoutFunction() {
  typing = false
  socket.emit('user_typing', false)
}

// sets typing to true while user is typing, and 2 seconds after (configurable)
input.addEventListener('keyup', () => {
  typing = true
  socket.emit('user_typing', true)
  clearTimeout(timeout)
  timeout = setTimeout(timeoutFunction, 2000)
})

// Does what it says on the tin
socket.on('user_typing', data => {
  if (data.typing) {
    typingTag.innerHTML = `${data.user} is typing...`
  } else {
    typingTag.innerHTML = ''
  }
})

/* ^ TYPING STUFF ^ */
