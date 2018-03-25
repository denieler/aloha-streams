const mongoose = require('mongoose')

const userChallengeSettingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', unique: true },
  fee: Number
}, { timestamps: true })

const UserChallengeSetting = mongoose.model('User_Challenge_Setting', userChallengeSettingSchema);

UserChallengeSetting.updateSettings = ({streamerId, fee, callback}) => {
  const query = {}
  const update = {
    user: streamerId,
    fee
  }
  const options = {
    upsert: true,
    setDefaultsOnInsert: true
  }
  
  UserChallengeSetting
    .findOneAndUpdate(query, update, options, callback)
}

UserChallengeSetting.getSettings = ({streamerId}) => {
  return UserChallengeSetting.findOne({
    user: streamerId
  }).exec()
}

module.exports = UserChallengeSetting
