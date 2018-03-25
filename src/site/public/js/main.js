document.addEventListener('DOMContentLoaded', function () {
  new ClipboardJS('.btn')
  
  // /challenges/mine

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
      if (result.error)
        throw new Error('Can\'t accept challenge because something happened on server side')

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
      if (result.error)
        throw new Error('Can\'t accept challenge because something happened on server side')

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
      if (result.error)
        throw new Error('Can\'t accept challenge because something happened on server side')

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

})
