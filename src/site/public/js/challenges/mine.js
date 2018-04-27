/* global io */

document.addEventListener('DOMContentLoaded', function () {
  const onChallengeAccepted = (e) => {
    const challengeId = e.target.dataset.challengeId
    const _csrf = document.getElementById('_csrf').value
    return fetch('/challenge/accept', {
      body: JSON.stringify({
        challengeId
      }),
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'X-CSRF-Token': _csrf,
        'content-type': 'application/json',
        'accept': 'application/json'
      },
      method: 'POST',
      credentials: 'same-origin'
    })
      .then(response => response.json())
      .then(result => {
        if (result.error) {
          throw new Error('Can\'t accept challenge because something happened on server side')
        }

        window.location.reload()
      })
  }

  const onChallengeRejected = (e) => {
    const challengeId = e.target.dataset.challengeId
    const _csrf = document.getElementById('_csrf').value
    return fetch('/challenge/reject', {
      body: JSON.stringify({
        challengeId
      }),
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'X-CSRF-Token': _csrf,
        'content-type': 'application/json',
        'accept': 'application/json'
      },
      method: 'POST',
      credentials: 'same-origin'
    })
      .then(response => response.json())
      .then(result => {
        if (result.error) {
          throw new Error('Can\'t accept challenge because something happened on server side')
        }

        window.location.reload()
      })
  }

  const onChallengeDone = (e) => {
    const challengeId = e.target.dataset.challengeId
    const _csrf = document.getElementById('_csrf').value
    return fetch('/challenge/done', {
      body: JSON.stringify({
        challengeId
      }),
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'X-CSRF-Token': _csrf,
        'content-type': 'application/json',
        'accept': 'application/json'
      },
      method: 'POST',
      credentials: 'same-origin'
    })
      .then(response => response.json())
      .then(result => {
        if (result.error) {
          throw new Error('Can\'t accept challenge because something happened on server side')
        }

        window.location.reload()
      })
  }

  const acceptChallengeBtns = document.getElementsByClassName('accept-challenge')
  for (const acceptChallengeBtn of acceptChallengeBtns) {
    acceptChallengeBtn.addEventListener('click', onChallengeAccepted)
  }

  const rejectChallengeBtns = document.getElementsByClassName('reject-challenge')
  for (const rejectChallengeBtn of rejectChallengeBtns) {
    rejectChallengeBtn.addEventListener('click', onChallengeRejected)
  }

  const doneChallengeBtns = document.getElementsByClassName('done-challenge')
  for (const doneChallengeBtn of doneChallengeBtns) {
    doneChallengeBtn.addEventListener('click', onChallengeDone)
  }

  const config = JSON.parse(document.getElementById('json-socket-config').textContent)
  const streamerId = config.streamerId
  const socket = io.connect(config.serverUrl, { query: { 'streamerId': streamerId } })
  socket.on('new-challenge-created', function (challenge) {
    window.location.reload()
  })
})
