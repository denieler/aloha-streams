const bluebird = require('bluebird')
const crypto = bluebird.promisifyAll(require('crypto'))
const nodemailer = require('nodemailer')
const passport = require('passport')
const User = require('../models/User')
const UserChallengeSetting = require('../models/UserChallengeSetting')
const Payment = require('../models/Payment')
const { DEFAULT_FEE } = require('../constants/challengeConfiguration')
const { getFullUrlFromRequest } = require('../utils/fullUrlBuilder')
const PAYMENT_STATUS = require('../constants/paymentStatus')

/**
 * GET /login
 * Login page.
 */
exports.getLogin = (req, res) => {
  if (req.user) {
    return res.redirect('/')
  }
  res.render('account/login', {
    title: 'Login'
  })
}

/**
 * POST /login
 * Sign in using email and password.
 */
exports.postLogin = (req, res, next) => {
  req.assert('email', 'Email is not valid').isEmail()
  req.assert('password', 'Password cannot be blank').notEmpty()
  req.sanitize('email').normalizeEmail({ gmail_remove_dots: false })

  const errors = req.validationErrors()

  if (errors) {
    req.flash('errors', errors)
    return res.redirect('/login')
  }

  passport.authenticate('local', (err, user, info) => {
    if (err) { return next(err) }
    if (!user) {
      req.flash('errors', info)
      return res.redirect('/login')
    }
    req.logIn(user, (err) => {
      if (err) { return next(err) }
      req.flash('success', { msg: 'Success! You are logged in.' })
      res.redirect(req.session.returnTo || '/')
    })
  })(req, res, next)
}

/**
 * GET /logout
 * Log out.
 */
exports.logout = (req, res) => {
  req.logout()
  res.redirect('/')
}

/**
 * GET /signup
 * Signup page.
 */
exports.getSignup = (req, res) => {
  if (req.user) {
    return res.redirect('/')
  }
  res.render('account/signup', {
    title: 'Create Account'
  })
}

/**
 * POST /signup
 * Create a new local account.
 */
exports.postSignup = (req, res, next) => {
  req.assert('email', 'Email is not valid').isEmail()
  req.assert('password', 'Password must be at least 4 characters long').len(4)
  req.assert('confirmPassword', 'Passwords do not match').equals(req.body.password)
  req.sanitize('email').normalizeEmail({ gmail_remove_dots: false })

  const errors = req.validationErrors()

  if (errors) {
    req.flash('errors', errors)
    return res.redirect('/signup')
  }

  const user = new User({
    email: req.body.email,
    password: req.body.password
  })

  User.findOne({ email: req.body.email }, (err, existingUser) => {
    if (err) { return next(err) }
    if (existingUser) {
      req.flash('errors', { msg: 'Account with that email address already exists.' })
      return res.redirect('/signup')
    }
    user.save((err) => {
      if (err) { return next(err) }
      req.logIn(user, (err) => {
        if (err) {
          return next(err)
        }
        res.redirect('/')
      })
    })
  })
}

/**
 * GET /account
 * Profile page.
 */
exports.getAccount = (req, res) => {
  res.render('account/profile', {
    title: 'Account Management'
  })
}

/**
 * POST /account/profile
 * Update profile information.
 */
exports.postUpdateProfile = (req, res, next) => {
  req.assert('email', 'Please enter a valid email address.').isEmail()
  req.sanitize('email').normalizeEmail({ gmail_remove_dots: false })

  const errors = req.validationErrors()

  if (errors) {
    req.flash('errors', errors)
    return res.redirect('/account')
  }

  User.findById(req.user.id, (err, user) => {
    if (err) { return next(err) }
    user.email = req.body.email || ''
    user.profile.name = req.body.name || ''
    user.profile.gender = req.body.gender || ''
    user.profile.location = req.body.location || ''
    user.profile.website = req.body.website || ''
    user.save((err) => {
      if (err) {
        if (err.code === 11000) {
          req.flash('errors', { msg: 'The email address you have entered is already associated with an account.' })
          return res.redirect('/account')
        }
        return next(err)
      }
      req.flash('success', { msg: 'Profile information has been updated.' })
      res.redirect('/account')
    })
  })
}

/**
 * POST /account/password
 * Update current password.
 */
exports.postUpdatePassword = (req, res, next) => {
  req.assert('password', 'Password must be at least 4 characters long').len(4)
  req.assert('confirmPassword', 'Passwords do not match').equals(req.body.password)

  const errors = req.validationErrors()

  if (errors) {
    req.flash('errors', errors)
    return res.redirect('/account')
  }

  User.findById(req.user.id, (err, user) => {
    if (err) { return next(err) }
    user.password = req.body.password
    user.save((err) => {
      if (err) { return next(err) }
      req.flash('success', { msg: 'Password has been changed.' })
      res.redirect('/account')
    })
  })
}

/**
 * POST /account/delete
 * Delete user account.
 */
exports.postDeleteAccount = (req, res, next) => {
  User.remove({ _id: req.user.id }, (err) => {
    if (err) { return next(err) }
    req.logout()
    req.flash('info', { msg: 'Your account has been deleted.' })
    res.redirect('/')
  })
}

/**
 * GET /account/unlink/:provider
 * Unlink OAuth provider.
 */
exports.getOauthUnlink = (req, res, next) => {
  const provider = req.params.provider
  User.findById(req.user.id, (err, user) => {
    if (err) { return next(err) }
    user[provider] = undefined
    user.tokens = user.tokens.filter(token => token.kind !== provider)
    user.save((err) => {
      if (err) { return next(err) }
      req.flash('info', { msg: `${provider} account has been unlinked.` })
      res.redirect('/account')
    })
  })
}

/**
 * GET /reset/:token
 * Reset Password page.
 */
exports.getReset = (req, res, next) => {
  if (req.isAuthenticated()) {
    return res.redirect('/')
  }
  User
    .findOne({ passwordResetToken: req.params.token })
    .where('passwordResetExpires').gt(Date.now())
    .exec((err, user) => {
      if (err) { return next(err) }
      if (!user) {
        req.flash('errors', { msg: 'Password reset token is invalid or has expired.' })
        return res.redirect('/forgot')
      }
      res.render('account/reset', {
        title: 'Password Reset'
      })
    })
}

/**
 * POST /reset/:token
 * Process the reset password request.
 */
exports.postReset = (req, res, next) => {
  req.assert('password', 'Password must be at least 4 characters long.').len(4)
  req.assert('confirm', 'Passwords must match.').equals(req.body.password)

  const errors = req.validationErrors()

  if (errors) {
    req.flash('errors', errors)
    return res.redirect('back')
  }

  const resetPassword = () =>
    User
      .findOne({ passwordResetToken: req.params.token })
      .where('passwordResetExpires').gt(Date.now())
      .then((user) => {
        if (!user) {
          req.flash('errors', { msg: 'Password reset token is invalid or has expired.' })
          return res.redirect('back')
        }
        user.password = req.body.password
        user.passwordResetToken = undefined
        user.passwordResetExpires = undefined
        return user.save().then(() => new Promise((resolve, reject) => {
          req.logIn(user, (err) => {
            if (err) { return reject(err) }
            resolve(user)
          })
        }))
      })

  const sendResetPasswordEmail = (user) => {
    if (!user) { return }
    const transporter = nodemailer.createTransport({
      service: 'SendGrid',
      auth: {
        user: process.env.SENDGRID_USER,
        pass: process.env.SENDGRID_PASSWORD
      }
    })
    const mailOptions = {
      to: user.email,
      from: 'hackathon@starter.com',
      subject: 'Your Hackathon Starter password has been changed',
      text: `Hello,\n\nThis is a confirmation that the password for your account ${user.email} has just been changed.\n`
    }
    return transporter.sendMail(mailOptions)
      .then(() => {
        req.flash('success', { msg: 'Success! Your password has been changed.' })
      })
  }

  resetPassword()
    .then(sendResetPasswordEmail)
    .then(() => { if (!res.finished) res.redirect('/') })
    .catch(err => next(err))
}

/**
 * GET /forgot
 * Forgot Password page.
 */
exports.getForgot = (req, res) => {
  if (req.isAuthenticated()) {
    return res.redirect('/')
  }
  res.render('account/forgot', {
    title: 'Forgot Password'
  })
}

/**
 * POST /forgot
 * Create a random token, then the send user an email with a reset link.
 */
exports.postForgot = (req, res, next) => {
  req.assert('email', 'Please enter a valid email address.').isEmail()
  req.sanitize('email').normalizeEmail({ gmail_remove_dots: false })

  const errors = req.validationErrors()

  if (errors) {
    req.flash('errors', errors)
    return res.redirect('/forgot')
  }

  const createRandomToken = crypto
    .randomBytesAsync(16)
    .then(buf => buf.toString('hex'))

  const setRandomToken = token =>
    User
      .findOne({ email: req.body.email })
      .then((user) => {
        if (!user) {
          req.flash('errors', { msg: 'Account with that email address does not exist.' })
        } else {
          user.passwordResetToken = token
          user.passwordResetExpires = Date.now() + 3600000 // 1 hour
          user = user.save()
        }
        return user
      })

  const sendForgotPasswordEmail = (user) => {
    if (!user) { return }
    const token = user.passwordResetToken
    const transporter = nodemailer.createTransport({
      service: 'SendGrid',
      auth: {
        user: process.env.SENDGRID_USER,
        pass: process.env.SENDGRID_PASSWORD
      }
    })
    const mailOptions = {
      to: user.email,
      from: 'hackathon@starter.com',
      subject: 'Reset your password on Hackathon Starter',
      text: `You are receiving this email because you (or someone else) have requested the reset of the password for your account.\n\n
        Please click on the following link, or paste this into your browser to complete the process:\n\n
        http://${req.headers.host}/reset/${token}\n\n
        If you did not request this, please ignore this email and your password will remain unchanged.\n`
    }
    return transporter.sendMail(mailOptions)
      .then(() => {
        req.flash('info', { msg: `An e-mail has been sent to ${user.email} with further instructions.` })
      })
  }

  createRandomToken
    .then(setRandomToken)
    .then(sendForgotPasswordEmail)
    .then(() => res.redirect('/forgot'))
    .catch(next)
}

/**
 * GET /account/challenges
 * The challenges configuration page
 */
exports.getChallengesConfiguration = async (req, res, next) => {
  if (!req.user) {
    return res.redirect('/login')
  }

  let configuration = {}
  try {
    configuration = await UserChallengeSetting.getSettings({
      streamerId: req.user.id
    })

    if (!configuration) {
      configuration = {
        fee: DEFAULT_FEE
      }
    }
  } catch (error) {
    next(error)
  }

  const shareLink = getFullUrlFromRequest(req) +
    '/challenges/new/' + req.user.id

  res.render('account/challenges', {
    title: 'Challenge setup',
    configuration,
    shareLink
  })
}

/**
 * POST /account/challenges
 * Save challenge configurations
 */
exports.postChallengesConfiguration = (req, res, next) => {
  req.assert('fee', 'Fee can not be empty.').notEmpty()

  const errors = req.validationErrors()

  if (errors) {
    req.flash('errors', errors)
    return res.redirect('/account/challenges')
  }

  const fee = req.body.fee

  UserChallengeSetting.updateSettings({
    streamerId: req.user.id,
    fee,
    callback: error => {
      if (error) {
        next(error)
      }
      res.redirect('/account/challenges')
    }
  })
}

/**
 * GET /account/widgets
 * Widgets configuration account page
 */
exports.getWidgetsConfiguration = (req, res, next) => {
  const challengeListWidgetLink = getFullUrlFromRequest(req) +
    '/widget/challenge-list/' + req.user.id

  const newChallengeWidgetLink = getFullUrlFromRequest(req) +
    '/widget/new-challenge/' + req.user.id

  const newChallengeWidgetTestNewChallegeLink = getFullUrlFromRequest(req) +
    '/widget/new-challenge/test-task/' + req.user.id

  res.render('account/widgets', {
    challengeListWidgetLink,
    newChallengeWidgetLink,
    newChallengeWidgetTestNewChallegeLink
  })
}

/**
 * GET /account/payments
 * Streamer's payments page
 */
exports.getPayments = async (req, res, next) => {
  const PAYMENT_STATUS_MAP = {
    [PAYMENT_STATUS.ON_HOLD]: 'On Hold',
    [PAYMENT_STATUS.RETURNED_TO_VIEWER]: 'Returned to the viewer',
    [PAYMENT_STATUS.ON_VERIFICATION]: 'On Verification',
    [PAYMENT_STATUS.PAID_TO_STREAMER]: 'Paid'
  }

  const payments = await Payment.getAllForStreamer({ streamerId: req.user.id })
  const displayPayments = payments.map(payment => {
    return {
      id: payment._id,
      challengeName: payment.challenge.name,
      reward: payment.challenge.price,
      fee: payment.challenge.fee,
      status: PAYMENT_STATUS_MAP[payment.status]
    }
  })

  const totalPaid = payments
    .filter(payment => payment.status === PAYMENT_STATUS.PAID_TO_STREAMER)
    .reduce((acc, payment) => {
      return acc + payment.challenge.price + payment.challenge.fee
    }, 0)

  const totalOnVerification = payments
    .filter(payment => payment.status === PAYMENT_STATUS.ON_VERIFICATION)
    .reduce((acc, payment) => {
      return acc + payment.challenge.price + payment.challenge.fee
    }, 0)

  res.render('account/payments', {
    payments: displayPayments,
    totalPaid,
    totalOnVerification,
    PAYMENT_STATUS: PAYMENT_STATUS_MAP
  })
}
