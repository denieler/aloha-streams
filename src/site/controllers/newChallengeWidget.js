/**
 * GET /widget/new-challenge/:streamerId
 * New Challenge Widget page
 */
exports.getNewChallengeWidget = async (req, res) => {
  // const streamerId = req.params.streamerId

  res.render('widget/new-challenge', {
    nickname: 'denieler',
    challengeText: 'Open your mouth and show your teeth',
    price: '40$'
  })
}
