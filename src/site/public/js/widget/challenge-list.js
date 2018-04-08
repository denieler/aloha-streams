document.addEventListener('DOMContentLoaded', function () {
  const challengeListDisplay = document.getElementById('challenge-list-diplay')
  const challengeListAccepted = document.getElementById('challenge-list-accepted')
  const challengeListDone = document.getElementById('challenge-list-done')
  const challengeListNoChallenges = document.getElementById('challenge-list-no-challenges')
  const inProgressHeaderNode = document.getElementById('in-progress-header')
  const doneHeaderNode = document.getElementById('done-header')

  const numberOfDisplayedChallenges = 2
  const animationDelay = 0.4
  const secondsDelayBetweenAnimations = 8 + animationDelay

  const acceptedChallenges = challengeListAccepted.getElementsByClassName('challenge')
  const doneChallenges = challengeListDone.getElementsByClassName('challenge')

  const reloadPageTime = calculateFullPageReloadTime(acceptedChallenges.length, doneChallenges.length, numberOfDisplayedChallenges, secondsDelayBetweenAnimations)

  function calculateFullPageReloadTime (acceptedChallengesLength, doneChallengesLength, numberOfDisplayedChallenges, secondsDelayBetweenAnimations) {
    const acceptedChallengesAmount = acceptedChallengesLength
    const doneChallengesAmount = doneChallengesLength

    const acceptedChallengesAmountOfSeconds = acceptedChallengesAmount
      ? Math.ceil(acceptedChallengesAmount / numberOfDisplayedChallenges)
      : 1

    const doneChallengesAmountOfSeconds = doneChallengesAmount
      ? Math.ceil(doneChallengesAmount / numberOfDisplayedChallenges)
      : 0

    const calculatedAmountOfSeconds = acceptedChallengesAmountOfSeconds + doneChallengesAmountOfSeconds

    const reloadTime = calculatedAmountOfSeconds * secondsDelayBetweenAnimations * 1000

    return reloadTime
  }

  // console tests :)
  // console.log('None accepted and done', calculateFullPageReloadTime(0, 0, numberOfDisplayedChallenges, 1))
  // console.log('1 accepted and none done', calculateFullPageReloadTime(1, 0, numberOfDisplayedChallenges, 1))
  // console.log('None accepted and 1 done', calculateFullPageReloadTime(0, 1, numberOfDisplayedChallenges, 1))
  // console.log('5 accepted and 1 done', calculateFullPageReloadTime(5, 1, numberOfDisplayedChallenges, 1))
  // console.log('5 accepted and 4 done', calculateFullPageReloadTime(5, 4, numberOfDisplayedChallenges, 1))

  function showChallengesInDisplayList (challengeListDisplay, challenges, index, numberOfDisplayedChallenges, challengeListNoChallenges) {
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

  function hideNode (node) {
    node.classList.add('--hidden')
  }

  function fadeOutNode (node) {
    node.classList.add('--fade-out')
    node.classList.remove('--fade-in')

    return new Promise(resolve => {
      setTimeout(resolve, animationDelay * 1000)
    })
  }

  function fadeInNode (node) {
    node.classList.add('--fade-in')
    node.classList.remove('--hidden')
    node.classList.remove('--fade-out')

    return new Promise(resolve => {
      setTimeout(resolve, animationDelay * 1000)
    })
  }

  function showNextChallenges () {
    challengeListDisplay.innerHTML = ''

    if (challengeType === CHALLENGE_TYPES.ACCEPTED) {
      fadeOutNode(doneHeaderNode)
        .then(_ => {
          hideNode(doneHeaderNode)
          fadeInNode(inProgressHeaderNode)
        })
    } else if (challengeType === CHALLENGE_TYPES.DONE) {
      fadeOutNode(inProgressHeaderNode)
        .then(_ => {
          hideNode(inProgressHeaderNode)
          fadeInNode(doneHeaderNode)
        })
    }

    fadeOutNode(challengeListDisplay)
      .then(_ => {
        if (challengeType === CHALLENGE_TYPES.ACCEPTED) {
          showChallengesInDisplayList(challengeListDisplay, acceptedChallenges, currentChallengeIndex, numberOfDisplayedChallenges, challengeListNoChallenges)
        } else if (challengeType === CHALLENGE_TYPES.DONE) {
          showChallengesInDisplayList(challengeListDisplay, doneChallenges, currentChallengeIndex, numberOfDisplayedChallenges, challengeListNoChallenges)
        }
        fadeInNode(challengeListDisplay)

        currentChallengeIndex += numberOfDisplayedChallenges
        if (currentChallengeIndex > acceptedChallenges.length - 1) {
          currentChallengeIndex = 0
          challengeType = CHALLENGE_TYPES.DONE
        }
      })
  }

  function getUrlParamValue (paramName) {
    if (!window.location.search) {
      return null
    }

    const params = window.location.search.substring(1).split('&')

    for (const param of params) {
      const paramObject = param.split('=')
      if (!paramObject[0]) {
        continue
      }

      if (paramObject[0] === paramName) {
        return paramObject[1] || true
      }
    }

    return null
  }

  const removeLoopAnimation = getUrlParamValue('removeLoopAnimation')
  if (removeLoopAnimation) {
    challengeListDisplay.innerHTML = ''
    showNextChallenges()
    return
  }

  setInterval(_ => {
    showNextChallenges()
  }, secondsDelayBetweenAnimations * 1000)
  showNextChallenges()

  setTimeout(function () {
    window.location.reload()
  }, reloadPageTime - 200)
})
