const mongoose = require('mongoose')

const challengeStatusSchema = new mongoose.Schema({
  status: String,
  reason: String,

  payment: { type: mongoose.Schema.Types.ObjectId, ref: 'Payment' }
}, { timestamps: true })

const ChallengeStatus = mongoose.model('Challenge_Status', challengeStatusSchema)

module.exports = ChallengeStatus
