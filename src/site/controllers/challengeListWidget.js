const Challenge = require('../models/Challenge')
const CHALLENGE_STATUS = require('../constants/challengeStatus')
const { DONE_CHALLENGES_AMOUNT } = require('../constants/widgetChallengeList')
const { formatDuration } = require('../utils/durationFormatter')

/**
 * GET /widget/challenge-list
 * Challenge List Widget page
 */
exports.getChallengeListWidget = async (req, res) => {
  const streamerId = req.params.streamerId

  const challenges = await Challenge.getAllForStreamer({ streamerId })
  const acceptedChallenges = challenges.filter(challenge =>
    challenge.currentChallengeStatus.status === CHALLENGE_STATUS.ACCEPTED
  )
  const doneChallenges = challenges.filter(challenge =>
    challenge.currentChallengeStatus.status === CHALLENGE_STATUS.DONE
  ).slice(0, DONE_CHALLENGES_AMOUNT)

  res.render('widget/challenge-list', {
    acceptedChallenges,
    doneChallenges,
    formatDuration
  })
}
