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
  // let sec = duration / 1000

  // if (sec <= 60) {
  //   return sec + ' sec.'
  // }

  // let minutes = Math.trunc(sec / 60)
  // sec = duration / 1000 - minutes * 60
  // if (minutes <= 60) {
  //   if (sec > 0) {
  //     return minutes + ' min. ' + sec + ' sec.'
  //   } else {
  //     return minutes + ' min.'
  //   }
  // }

  // let hours = Math.trunc(minutes / 60)
  // minutes = Math.trunc(minutes - hours * 60)
  // if (minutes > 0) {
  //   return hours + ' h. ' + minutes + ' min.'
  // }

  // return hours + ' h.'
}
