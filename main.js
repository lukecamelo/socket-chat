const button = document.querySelector('#button')
const input = document.querySelector('#chat-input')
const usernameForm = document.querySelector('#username-form')
const chatForm = document.querySelector('#chat-form')
const chatroom = document.querySelector('#chatroom')
const messageContainer = document.querySelector('.message-container')
const typingContainer = document.querySelector('#typing')
const socket = io.connect('http://localhost:3000')

let username

// Will soon be removed to make way for a proper input form
// button.addEventListener('click', () => {
//   socket.emit('chat message', {
//     message: input.value,
//     username: username
//   })
//   input.value = ''
//   return false
// })

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

chatForm.addEventListener('submit', e => {
  e.preventDefault()
  socket.emit('chat message', {
    message: input.value,
    username
  })
  input.value = ''
  return false
})

/* v TYPING STUFF v */

let typing,
  timeout,
  userCount,
  connectedUsers = []

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
let typingUsers = []
socket.on('user_typing', ({ typing, user }) => {
  // when the server pings back after being told someone is typing, set the typing dialogue accordingly
  if (!typingUsers.includes(user)) {
    typingUsers.push(user)
  }
  console.log(typingUsers)
  if (typing) {
    typingContainer.firstChild.innerHTML = `${typingUsers} is typing...`
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

socket.on('add_user', data => {
  connectedUsers = data.connectedUsers
})

/* ^ TYPING STUFF ^ */
