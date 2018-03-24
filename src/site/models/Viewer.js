const mongoose = require('mongoose')

const viewerSchema = new mongoose.Schema({
  nickname: { type: String, unique: true },
  //   password: String,
  //   passwordResetToken: String,
  //   passwordResetExpires: Date,

  //   facebook: String,
  //   twitter: String,
  //   google: String,
  //   github: String,
  //   instagram: String,
  //   linkedin: String,
  //   steam: String,
  //   tokens: Array,

  profile: {
    name: String,
    gender: String,
    location: String,
    website: String,
    picture: String
  }
}, { timestamps: true })

const Viewer = mongoose.model('Viewer', viewerSchema);

module.exports = Viewer
