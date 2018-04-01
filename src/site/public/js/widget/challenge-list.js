document.addEventListener('DOMContentLoaded', function () {
  const challengeListDisplay = document.getElementById('challenge-list-diplay')
  const challengeListAccepted = document.getElementById('challenge-list-accepted')
  const challengeListDone = document.getElementById('challenge-list-done')
  const challengeListNoChallenges = document.getElementById('challenge-list-no-challenges')

  const numberOfDisplayedChallenges = 3
  const secondsDelayBetweenAnimations = 4
  // const animationDelay = 0.5

  const acceptedChallenges = challengeListAccepted.getElementsByClassName('challenge')
  const doneChallenges = challengeListDone.getElementsByClassName('challenge')

  const reloadPageTime =
    (acceptedChallenges.length + doneChallenges.length) % numberOfDisplayedChallenges === 0
      ? (
        Math.trunc(acceptedChallenges.length / numberOfDisplayedChallenges) +
        Math.trunc(doneChallenges.length / numberOfDisplayedChallenges)
      ) * secondsDelayBetweenAnimations * 1000
      : (
        Math.trunc(acceptedChallenges.length / numberOfDisplayedChallenges) +
        Math.trunc(doneChallenges.length / numberOfDisplayedChallenges) +
        1
      ) * secondsDelayBetweenAnimations * 1000

  function showChallenges (challenges, index) {
    if (challenges.length) {
      const sliceOfChallenges = Array.prototype.slice.call(challenges, index, index + numberOfDisplayedChallenges)
      sliceOfChallenges.map(challenge => {
        const challengeNodeClone = challenge.cloneNode(true)
        challengeListDisplay.appendChild(challengeNodeClone)
      })
    } else {
      challengeListDisplay.innerHTML = challengeListNoChallenges.innerHTML
    }
  }

  let currentChallengeIndex = 0
  const CHALLENGE_TYPES = {
    ACCEPTED: 'ACCEPTED',
    DONE: 'DONE'
  }
  let challengeType = CHALLENGE_TYPES.ACCEPTED

  function showInProgressHeader () {

  }

  function showDoneHeader () {

  }

  function showNextChallenges () {
    if (challengeType === CHALLENGE_TYPES.ACCEPTED) {
      showInProgressHeader()
      showChallenges(acceptedChallenges, currentChallengeIndex)
    } else if (challengeType === CHALLENGE_TYPES.DONE) {
      showDoneHeader()
      showChallenges(doneChallenges, currentChallengeIndex)
    }

    currentChallengeIndex += numberOfDisplayedChallenges
    if (currentChallengeIndex > acceptedChallenges.length - 1) {
      currentChallengeIndex = 0
      challengeType = CHALLENGE_TYPES.DONE
    }
  }

  setInterval(_ => {
    challengeListDisplay.innerHTML = ''
    showNextChallenges()
  }, secondsDelayBetweenAnimations * 1000)
  showNextChallenges()

  console.log('Reload time:', reloadPageTime / 1000)
  setTimeout(function () {
    window.location.reload()
  }, reloadPageTime - 300)
})
