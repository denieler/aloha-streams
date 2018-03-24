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

  currentChallengeStatusId: { type: mongoose.Schema.Types.ObjectId, ref: 'Challenge_Status' },
  challengeStatuses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Challenge_Status' }],

  viewerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Viewer' },
  streamerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true })
  
const Challenge = mongoose.model('Challenge', challengeSchema);

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
  var challenge = new Challenge({
    name,
    description,
    price,
    fee,
    duration
  })
  
  // add challenge status
  const newChallengeStatusId = mongoose.Types.ObjectId()
  var newChallengeStatus = new ChallengeStatus({
    _id: newChallengeStatusId,
    status: CHALLENGE_STATUS.NEW,
    reason: null
  })
  newChallengeStatus.save()

  challenge.currentChallengeStatusId = newChallengeStatusId
  challenge.challengeStatuses = [newChallengeStatusId]

  // add viewer
  const viewerId = mongoose.Types.ObjectId()
  const viewer = new Viewer({
    _id: viewerId,
    nickname
  })
  viewer.save()
  challenge.viewerId = viewer

  challenge.streamerId = streamerId

  challenge.save(err => {
    callback(err)
  })
}

module.exports = Challenge;
