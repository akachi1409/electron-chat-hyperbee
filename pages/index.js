/* eslint-disable quotes */

const msgerForm = get('.msger-inputarea')
const msgerInput = get('.msger-input')
const msgerChat = get('.msger-chat')

// Icons made by Freepik from www.flaticon.com
const BOT_IMG = 'https://avatarfiles.alphacoders.com/893/thumb-89303.gif'
const PERSON_IMG =
  'https://cdn.pixabay.com/photo/2016/08/20/05/38/avatar-1606916__340.png'
const PERSON_NAME = 'You'

msgerForm.addEventListener('submit', (event) => {
  event.preventDefault()

  const msgText = msgerInput.value
  if (!msgText) return

  appendMessage(PERSON_NAME, PERSON_IMG, 'right', msgText)
  msgerInput.value = ''

  window.customApi.sendMessage(msgText)
})

function appendMessage(name, img, side, text) {
  //   Simple solution for small apps
  const msgHTML = `
    <div class="msg ${side}-msg">
      <div class="msg-img" style="background-image: url(${img})"></div>

      <div class="msg-bubble">
        <div class="msg-info">
          <div class="msg-info-name">${name}</div>
          <div class="msg-info-time">${formatDate(new Date())}</div>
        </div>

        <div class="msg-text">${text}</div>
      </div>
    </div>
  `

  msgerChat.insertAdjacentHTML('beforeend', msgHTML)
  msgerChat.scrollTop += 500
}

window.customApi.handleMessages((event, name, message) => {
  console.log(name, message)
  appendMessage(`${name.slice(0, 7)}.....`, BOT_IMG, 'left', message)
})

window.customApi.handleOldMessages((event, name, message) => {
  console.log(name, message);
  appendMessage('You', PERSON_IMG, 'right', message);
})
// Utils
function get(selector, root = document) {
  return root.querySelector(selector)
}

function formatDate(date) {
  const h = '0' + date.getHours()
  const m = '0' + date.getMinutes()

  return `${h.slice(-2)}:${m.slice(-2)}`
}
