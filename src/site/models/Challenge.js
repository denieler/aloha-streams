const mongoose = require('mongoose')

const ChallengeStatus = require('./ChallengeStatus')
const Viewer = require('./Viewer')
const CHALLENGE_STATUS = require('../constants/challengeStatus')

const challengeSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  fee: Number,
  duration: Number,

  currentChallengeStatus: { type: mongoose.Schema.Types.ObjectId, ref: 'Challenge_Status' },
  challengeStatuses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Challenge_Status' }],

  viewer: { type: mongoose.Schema.Types.ObjectId, ref: 'Viewer' },
  streamer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true })

const Challenge = mongoose.model('Challenge', challengeSchema)

Challenge.add = ({
  name,
  description,
  price,
  fee,
  duration,
  nickname,
  streamerId,
  callback
}) => {
  const challenge = new Challenge({
    name,
    description,
    price,
    fee,
    duration
  })

  // add challenge status
  const newChallengeStatusId = mongoose.Types.ObjectId()
  const newChallengeStatus = new ChallengeStatus({
    _id: newChallengeStatusId,
    status: CHALLENGE_STATUS.NOT_PAID,
    reason: null
  })
  newChallengeStatus.save()

  challenge.currentChallengeStatus = newChallengeStatusId
  challenge.challengeStatuses = [newChallengeStatusId]

  // add viewer
  const viewerId = mongoose.Types.ObjectId()
  const viewer = new Viewer({
    _id: viewerId,
    nickname
  })
  viewer.save()
  challenge.viewer = viewer

  challenge.streamer = streamerId

  return challenge.save()
}

Challenge.changeStatus = ({ challengeId, status, reason, payment, callback }) => {
  const challengeStatusId = mongoose.Types.ObjectId()
  const challengeStatus = new ChallengeStatus({
    _id: challengeStatusId,
    status,
    reason,
    payment
  })
  challengeStatus.save()

  return Challenge
    .update(
      { _id: challengeId },
      {
        $push: { challengeStatuses: challengeStatus },
        currentChallengeStatus: challengeStatusId
      }
    )
    .exec()
}

Challenge.get = ({
  challengeId
}) => {
  return Challenge.findOne({
    _id: challengeId
  })
    .populate('viewer')
    .exec()
}

Challenge.getAllForStreamer = ({ streamerId }) => {
  return Challenge
    .find({
      streamer: streamerId
    })
    .limit(10)
    .sort({ createdAt: -1 })
    .populate('currentChallengeStatus')
    .populate('viewer')
    .exec()
}

module.exports = Challenge
