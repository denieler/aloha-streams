const utils = require('../utils/durationFormatter')

exports.sendNewChallengeNotification = function (io, socketIoClients, streamerId, challenge) {
  try {
    const clientSocketId = socketIoClients[streamerId]
    if (!clientSocketId) {
      return
    }

    const challengeData = {
      name: challenge.name,
      price: challenge.price,
      duration: utils.formatDuration(challenge.duration),
      nickname: challenge.viewer.nickname
    }

    if (io.sockets.sockets[clientSocketId]) {
      io.sockets.sockets[clientSocketId].emit('new-challenge-created', challengeData)
    }
  } catch (socketError) {
    console.error('Socket notification has not been sent about paid challenge', streamerId, socketError)
  }
}
