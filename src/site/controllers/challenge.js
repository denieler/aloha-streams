const Challenge = require('../models/Challenge')
const UserChallengeSetting = require('../models/UserChallengeSetting')
const Payment = require('../models/Payment')
const CHALLENGE_STATUS = require('../constants/challengeStatus')
const { DEFAULT_FEE } = require('../constants/challengeConfiguration')
const PAYMENT_STATUS = require('../constants/paymentStatus')
const utils = require('../utils/durationFormatter')
const { getFullUrlFromRequest } = require('../utils/fullUrlBuilder')

/**
 * GET /challenges/new
 * New Challenge page
 */
exports.getNewChallenge = async (req, res) => {
  const streamerId = req.params.streamerId

  const configuration = await UserChallengeSetting.getSettings({
    streamerId
  })
  const fee = configuration ? configuration.fee : DEFAULT_FEE

  const challengeDurations = [
    { text: '5 minutes', time: 5 * 60 * 1000 },
    { text: '10 minutes', time: 10 * 60 * 1000 },
    { text: '1 hour', time: 1 * 60 * 60 * 1000 },
    { text: '3 hours', time: 3 * 60 * 60 * 1000 }
  ]

  res.render('challenges/new', {
    streamerId,
    fee,
    challengeDurations
  })
}

/**
 * GET /challenges/success
 * Success new challenge page
 */
exports.getSuccessNewChallenge = (req, res) => {
  const streamerId = req.query.streamerId
  const shareLink = getFullUrlFromRequest(req) +
    '/challenges/new/' + streamerId
  res.render('challenges/success', {
    newChallengeUrl: shareLink
  })
}

/**
 * POST /challenges/new
 * Create new challenge (supposed to be PUT method)
 */
exports.putNewChallenge = async (req, res, next) => {
  req.assert('streamerId', 'You have to have the streamer specified to create the new challenge').notEmpty()
  req.assert('name', 'Challenge task cannot be blank').notEmpty()
  req.assert('reward', 'Reward for the challenge cannot be empty or zero').notEmpty()
  req.assert('duration', 'Duration for the challenge cannot be empty or zero').notEmpty()

  const errors = req.validationErrors()

  if (errors) {
    req.flash('errors', errors)
    return res.redirect('/challenges/new')
  }

  const streamerId = req.body.streamerId
  try {
    const configuration = await UserChallengeSetting.getSettings({
      streamerId
    })
    const fee = configuration ? configuration.fee : DEFAULT_FEE
    const challenge = await Challenge.add({
      name: req.body.name,
      description: req.body.description,
      price: req.body.reward,
      fee,
      duration: req.body.duration,
      nickname: req.body.nickname,
      streamerId
    })

    return res.redirect(`/challenge/${challenge._id}/payment?streamerId=${streamerId}`)
  } catch (err) {
    next(err)
  }
}

/**
 * GET /challenges/mine
 * Page of Challenges of the streamer
 */
exports.getMyStreamerChallenges = async (req, res) => {
  if (!req.user) {
    return res.redirect('/')
  }

  const challenges = await Challenge.getAllForStreamer({ streamerId: req.user.id })
  const onlyPaidChallenges = challenges.filter(challenge => {
    return challenge.currentChallengeStatus.status !== CHALLENGE_STATUS.NOT_PAID
  })

  res.render('challenges/mine', {
    title: 'Challenges',
    challenges: onlyPaidChallenges,
    formatDuration: utils.formatDuration
  })
}

/**
 * GET /challenge/:challengeId/payment
 * Page with payment options when creating new challenge
 */
exports.getNewChallengePaymentOptions = async (req, res) => {
  const challengeId = req.params.challengeId
  const streamerId = req.query.streamerId
  const challenge = await Challenge.get({ challengeId })

  if (!challenge) {
    throw new Error('Challenge has not been found. Please contact our support.')
  }

  res.render('challenges/payment-options', {
    name: challenge.name,
    description: challenge.description,
    duration: utils.formatDuration(challenge.duration),
    price: challenge.price,
    fee: challenge.fee,
    challengeId: challenge._id,
    streamerId
  })
}

/**
 * POST /challenge/:challengeId/payment
 * Challenge has been successfully paid
 */
exports.postNewChallengePayment = async (req, res) => {
  req.assert('tokenId', 'Token id can not be empty').notEmpty()
  req.assert('paymentMehtod', 'Payment Method Name can not be empty').notEmpty()

  const challengeId = req.params.challengeId
  const tokenId = req.body.tokenId
  const paymentMehtod = req.body.paymentMehtod
  // const platformStatus = req.body.status

  const errors = req.validationErrors()

  if (errors) {
    req.flash('errors', errors)
    return res.redirect(`/challenge/${challengeId}/payment`)
  }

  try {
    const challenge = await Challenge.get({ challengeId })
    const streamerId = challenge.streamer
    const payment = await Payment.add({
      challengeId,
      streamerId,
      tokenId,
      paymentMehtod,
      status: PAYMENT_STATUS.ON_HOLD
    })

    await Challenge.changeStatus({
      challengeId,
      status: CHALLENGE_STATUS.NEW,
      payment: payment._id
    })

    try {
      const clientSocketId = req.socketIoClients[streamerId]
      const challengeData = {
        name: challenge.name,
        price: challenge.price,
        duration: utils.formatDuration(challenge.duration),
        nickname: challenge.viewer.nickname
      }
      req.io.sockets.sockets[clientSocketId].emit('new-challenge-created', challengeData)
    } catch (socketError) {
      console.error('Socket notification has not been sent about paid challenge', streamerId, socketError)
    }

    res.json({})
  } catch (err) {
    res.json({
      error: err
    })
  }
}

/**
 * POST /challenge/accept
 * Accept challenge
 */
exports.postAcceptChallenge = async (req, res) => {
  const challengeId = req.body.challengeId

  try {
    await Challenge.changeStatus({
      challengeId,
      status: CHALLENGE_STATUS.ACCEPTED
    })
    res.json({})
  } catch (err) {
    res.json({
      error: err
    })
  }
}

/**
 * POST /challenge/reject
 * Reject challenge
 */
exports.postRejectChallenge = async (req, res) => {
  const challengeId = req.body.challengeId

  try {
    await Challenge.changeStatus({
      challengeId,
      status: CHALLENGE_STATUS.REJECTED
    })
    Payment.changeStatusByChallengeId({
      challengeId,
      status: PAYMENT_STATUS.RETURNED_TO_VIEWER
    })
    res.json({})
  } catch (err) {
    res.json({
      error: err
    })
  }
}

/**
 * POST /challenge/done
 * Mark challenge as done
 */
exports.postDoneChallenge = async (req, res) => {
  const challengeId = req.body.challengeId

  try {
    await Challenge.changeStatus({
      challengeId,
      status: CHALLENGE_STATUS.DONE
    })
    Payment.changeStatusByChallengeId({
      challengeId,
      status: PAYMENT_STATUS.ON_VERIFICATION
    })
    res.json({})
  } catch (err) {
    res.json({
      error: err
    })
  }
}
