const button = document.querySelector('#button')
const input = document.querySelector('#chat-input')
const usernameForm = document.querySelector('#username-form')
const chatroom = document.querySelector('#chatroom')
const messageContainer = document.querySelector('.message-container')
const typingContainer = document.querySelector('#typing')
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

let typing, timeout, userCount

// returns typing variable to false shortly after user stops typing
function timeoutFunction() {
  typing = false
  socket.emit('user_typing', false)
}

// sets typing to true while user is typing, and 2 seconds after (configurable)
input.addEventListener('keyup', () => {
  typing = true
  // tell the server that typing is happening and also which user is doing the typing
  socket.emit('user_typing', {
    typing,
    user: username
  })
  clearTimeout(timeout)
  timeout = setTimeout(timeoutFunction, 10000)
})

// Does what it says on the tin
socket.on('user_typing', data => {
  // when the server pings back after being told someone is typing, set the typing dialogue accordingly
  // TODO: make it so that when multiple users are typing, display all of their names in the dialogue
  if (data.typing) {
    typingContainer.firstChild.innerHTML = `${data.user} is typing...`
  } else {
    typingContainer.firstChild.innerHTML = ''
  }
})

socket.on('new_user', data => {
  userCount = data.clients
})

socket.on('disconnect', data => {
  userCount = data.clients
})

/* ^ TYPING STUFF ^ */
