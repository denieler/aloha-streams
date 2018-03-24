const Challenge = require('../models/Challenge')
const CHALLENGE_STATUS = require('../constants/challengeStatus')
const User = require('../models/User')

/**
 * GET /challenges/new
 * New Challenge page
 */
exports.getNewChallenge = (req, res) => {
  res.render('challenges/new', {})
}

/**
 * GET /challenges/success
 * Success new challenge page
 */
exports.getSuccessNewChallenge = (req, res) => {
  res.render('challenges/success', {})
}

/**
 * POST /challenges/new
 * Create new challenge (supposed to be PUT method)
 */
exports.putNewChallenge = (req, res, next) => {
  req.assert('name', 'Challenge task cannot be blank').notEmpty()
  req.assert('reward', 'Reward for the challenge cannot be empty or zero').notEmpty()
  req.assert('duration', 'Duration for the challenge cannot be empty or zero').notEmpty()

  const errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/challenges/new');
  }

  const streamerId = null
  const fee = 1

  Challenge.add({
    name: req.body.name,
    description: req.body.description,
    price: req.body.reward,
    fee,
    duration: req.body.duration,
    nickname: req.body.nickname,
    streamerId,
    callback: err => {
      if (err) { return next(err) }

      return res.render('challenges/success', {});
    }
  })
}


/**
 * GET /challenges/mine
 * Page of Challenges of the streamer
 */
exports.getMyStreamerChallenges = (req, res) => {
  if (!req.user) {
    return res.redirect('/')
  }

  const streamerChallengesQuery = Challenge
    .find({
      streamer: req.user.id
    })
    .limit(10)
    .sort({ createdAt: -1 })
    .populate('currentChallengeStatus')

  streamerChallengesQuery
  .then(challenges => {
    console.log(challenges)
    res.render('challenges/mine', {
      title: 'Challenges',
      challenges
    })
  })
}

exports.postAcceptChallenge = (req, res) => {
  const challengeId = req.body.challengeId

  Challenge.changeStatus({
    challengeId,
    status: CHALLENGE_STATUS.ACCEPTED,
    callback: (err) => {
      res.json({
        error: err
      })
    }
  })
}

exports.postRejectChallenge = (req, res) => {
  const challengeId = req.body.challengeId

  Challenge.changeStatus({
    challengeId,
    status: CHALLENGE_STATUS.REJECTED,
    callback: (err) => {
      res.json({
        error: err
      })
    }
  })
}

exports.postDoneChallenge = (req, res) => {
  const challengeId = req.body.challengeId

  Challenge.changeStatus({
    challengeId,
    status: CHALLENGE_STATUS.DONE,
    callback: (err) => {
      res.json({
        error: err
      })
    }
  })
}
