const { getUrlWithoutPortFromRequest } = require('../utils/fullUrlBuilder')
const challengeSocketTransport = require('../services/challengeSocketTransport')
const coolChallengesGenerator = require('../utils/coolChallengesGenerator')

/**
 * GET /widget/new-challenge/:streamerId
 * New Challenge Widget page
 */
exports.getNewChallengeWidget = (req, res) => {
  const streamerId = req.params.streamerId
  const socketIoPort = req.app.get('socketIoPort')
  const serverUrl = getUrlWithoutPortFromRequest(req) + ':' + socketIoPort

  res.render('widget/new-challenge', {
    serverUrl,
    streamerId
  })
}

/**
 * GET /widget/new-challenge/test-task/:streamerId
 * Sends test task to the New Challenge widget
 */
exports.getNewChallengeWidgetTestTask = (req, res) => {
  const streamerId = req.params.streamerId
  const challenge = coolChallengesGenerator.generate()

  challengeSocketTransport.sendNewChallengeNotification(
    req.io,
    req.socketIoClients,
    streamerId,
    challenge
  )

  res.json({})
}
