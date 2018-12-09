const button = document.querySelector('#button')

const getMessage = () => {
  fetch('http://localhost:3000/', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
    // mode: 'cors'
  })
    .then(res => res.json())
    .then(res => console.log(res))
}

button.addEventListener('click', () => {
  getMessage()
})
