const mongoose = require('mongoose')

const paymentSchema = new mongoose.Schema({
  challenge: { type: mongoose.Schema.Types.ObjectId, ref: 'Challenge' },
  externalTransactionId: String,
  paymentMehtod: String,
  status: String,
  streamer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true })

const Payment = mongoose.model('Payment', paymentSchema)

Payment.add = ({ challengeId, streamerId, tokenId, paymentMehtod, status }) => {
  const payment = new Payment({
    challenge: challengeId,
    streamer: streamerId,
    externalTransactionId: tokenId,
    paymentMehtod,
    status
  })

  return payment.save()
}

Payment.getAllForStreamer = ({ streamerId }) => {
  return Payment
    .find({ streamer: streamerId })
    .sort({ createdAt: -1 })
    .populate('challenge')
    .exec()
}

Payment.changeStatusByChallengeId = ({ challengeId, status }) => {
  return Payment
    .update(
      { challenge: challengeId },
      {
        status
      }
    )
    .exec()
}

module.exports = Payment
