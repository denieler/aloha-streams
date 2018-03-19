/**
 * GET /challenges/new
 * New Challenge page
 */
exports.getNewChallenge = (req, res) => {
  res.render('challenges/new', {
    title: 'Contact'
  })
}

exports.putNewChallenge = (req, res) => {
  // res.render('challenges/new', {
  //   title: 'Contact'
  // })
}
