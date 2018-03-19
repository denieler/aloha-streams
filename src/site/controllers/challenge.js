const Challenge = require('../models/Challenge')

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
  console.log('Body:', req.body)
  const errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/signup');
  }

  const streamerId = 1
  Challenge.add({
    name: req.body.name,
    description: req.body.description,
    price: req.body.reward,
    fee: 1,
    duration: req.body.duration,
    nickname: req.body.nickname,
    streamerId,
    callback: err => {
      if (err) { return next(err) }

      return res.render('challenges/success', {});
    }
  })
}
