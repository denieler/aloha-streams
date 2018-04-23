/* global io */

const config = JSON.parse(document.getElementById('json-socket-config').textContent)
const streamerId = config.streamerId
const socket = io.connect(config.serverUrl, { query: { 'streamerId': streamerId } })
socket.on('new-challenge-created', function (challenge) {
  const name = challenge.name
  const price = challenge.price
  const nickname = challenge.nickname
  const duration = challenge.duration

  const newChallengePanel = document.getElementById('new-challenge')
  newChallengePanel.style.opacity = 1

  document.getElementById('new-challenge').style.opacity = 1
  document.getElementById('new-challenge-nickname').textContent = nickname
  document.getElementById('new-challenge-name').textContent = name
  document.getElementById('new-challenge-duration').textContent = duration
  document.getElementById('new-challenge-price').textContent = price + '$'

  setTimeout(() => {
    newChallengePanel.style.opacity = 0
  }, 15000)
})
