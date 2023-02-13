/* eslint-disable no-unused-vars */

function sendMessage() {
  const message = document.getElementById('message').value
  document.getElementById('message').value = ''
  window.customApi.sendMessage(message)
}

const messages = document.getElementById('messages')

window.customApi.handleMessages((event, name, message) => {
  messages.innerHTML = `Name: ${name}<br /> Message: ${message}`
})
