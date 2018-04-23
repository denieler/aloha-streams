document.addEventListener('DOMContentLoaded', function () {
  const config = JSON.parse(document.getElementById('json-widget-config').textContent)
  const newChallengeWidgetTestNewChallegeLink = config.newChallengeWidgetTestNewChallegeLink

  const newChallengeTestTaskLink = document.getElementById('new-challenge-widget-test-task-link')
  newChallengeTestTaskLink.addEventListener('click', function () {
    fetch(newChallengeWidgetTestNewChallegeLink)
  })
})
