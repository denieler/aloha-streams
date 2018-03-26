const mongoose = require('mongoose')

const challengeStatusSchema = new mongoose.Schema({
  status: String,
  reason: String
}, { timestamps: true })

const ChallengeStatus = mongoose.model('Challenge_Status', challengeStatusSchema)

module.exports = ChallengeStatus
