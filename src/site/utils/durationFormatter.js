exports.formatDuration = duration => {
  let result = []
  let ms = duration

  const days = Math.trunc(ms / (1000 * 60 * 60 * 24))
  if (days > 0) {
    result.push(days + ' d.')
    ms -= days * 1000 * 60 * 60 * 24
  }

  const hours = Math.trunc(ms / (1000 * 60 * 60))
  if (hours > 0) {
    result.push(hours + ' h.')
    ms -= hours * 1000 * 60 * 60
  }

  const minutes = Math.trunc(ms / (1000 * 60))
  if (minutes > 0) {
    result.push(minutes + ' min.')
    ms -= minutes * 1000 * 60
  }

  const seconds = Math.trunc(ms / (1000))
  if (seconds > 0) {
    result.push(seconds + ' sec.')
    ms -= seconds * 1000
  }

  return result.join(' ')
}
