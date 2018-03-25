exports.formatDuration = duration => {
  let sec = duration / 1000

  if (sec <= 60) {
    return sec + ' sec.'
  }

  let minutes = sec / 60
  if (minutes <= 60) {
    return minutes + ' min.'
  }

  let hours = minutes / 60
  minutes = duration / 1000 - hours * 60
  if (minutes > 0) {
    return hours + ' h. ' + minutes + ' min.'
  }

  return hours + ' h.'
}
