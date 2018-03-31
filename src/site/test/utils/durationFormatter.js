const { expect } = require('chai')
const { formatDuration } = require('../../utils/durationFormatter')

describe('formatDuration util test suite', () => {
  it('should show seconds text if duration has only seconds', () => {
    const seconds = 43 * 1000
    const result = formatDuration(seconds)
    expect(result).to.eq('43 sec.')
  })

  it('should show minutes only text if duration has just minutes amount in milliseconds', () => {
    const minutes = 12 * 60 * 1000
    const result = formatDuration(minutes)
    expect(result).to.eq('12 min.')
  })

  it('should show minutes and seconds text if duration has minutes and seconds more than 30 in milliseconds', () => {
    const minutesAndSeconds = 12 * 60 * 1000 + 37 * 1000
    const result = formatDuration(minutesAndSeconds)
    expect(result).to.eq('12 min. 37 sec.')
  })

  it('should show minutes and seconds text if duration has minutes and seconds less than 30 in milliseconds', () => {
    const minutesAndSeconds = 12 * 60 * 1000 + 17 * 1000
    const result = formatDuration(minutesAndSeconds)
    expect(result).to.eq('12 min. 17 sec.')
  })

  it('should show hours only text if duration has just hours amount in milliseconds', () => {
    const hours = 10 * 60 * 60 * 1000
    const result = formatDuration(hours)
    expect(result).to.eq('10 h.')
  })

  it('should show hours and minutes text if duration has hours and minutes more than 30 in milliseconds', () => {
    const hoursAndMinutes = 11 * 60 * 60 * 1000 + 37 * 60 * 1000
    const result = formatDuration(hoursAndMinutes)
    expect(result).to.eq('11 h. 37 min.')
  })

  it('should show hours and minutes text if duration has hours and minutes less than 30 in milliseconds', () => {
    const hoursAndMinutes = 11 * 60 * 60 * 1000 + 16 * 60 * 1000
    const result = formatDuration(hoursAndMinutes)
    expect(result).to.eq('11 h. 16 min.')
  })

  it('should show days only text if duration has just days amount in milliseconds', () => {
    const days = 10 * 24 * 60 * 60 * 1000
    const result = formatDuration(days)
    expect(result).to.eq('10 d.')
  })

  it('should show days and hours text if duration has days and hours in milliseconds', () => {
    const daysAndHours = 5 * 24 * 60 * 60 * 1000 + 11 * 60 * 60 * 1000
    const result = formatDuration(daysAndHours)
    expect(result).to.eq('5 d. 11 h.')
  })
})
