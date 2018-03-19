const mongoose = require('mongoose')
const CHALLENGE_STATUS = require('../constants/challengeStatus')

const ChallengeStatusSchema = new mongoose.Schema({
  _id: mongoose.Schema.ObjectId,
  status: String,
  reason: String
})

const challengeSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  fee: Number,
  duration: Number,

  challengeStatusId: mongoose.Schema.ObjectId,
  challengeStatus: [ChallengeStatusSchema],

  userId: mongoose.Schema.ObjectId,
  user: {
    nickname: String
  },

  streamerId: mongoose.Schema.ObjectId
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

  const challengeStatusId = mongoose.Types.ObjectId()
  challenge.challengeStatus.push({
    _id: challengeStatusId,
    status: CHALLENGE_STATUS.NEW,
    reason: null
  })
  challenge.challengeStatusId = challengeStatusId

  challenge.user = {
    nickname
  }

  challenge.save(err => {
    callback(err)
  })
}

module.exports = Challenge;
