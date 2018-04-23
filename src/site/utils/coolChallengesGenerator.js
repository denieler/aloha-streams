const Moniker = require('moniker')

const coolChallenges = [
  'Point at someone and shout "Your one of them!" Run and pretend to trip. Crawl away slowly',
  'Do you see that butterfly mooing over there... or is it just me?',
  'Look at see through glass and when someone is on the other side shout "OH MY GOD, I\'M HIDEOUS!"',
  'Run up to someone random on the street and slap them with a loaf of bread. ',
  'Go to McDonalds and ask for a happy meal with extra happy. ',
  'Put a dora doll in the middle of Walmart.When someone tries to pick it up yell "SWIPER NO SWIPING',
  'Walk up to a small child that resembles you, and tell them that you are them from the future. ',
  'If skinny people skinny dip what do fat people do? Chunky Dunk? ',
  'Go up to a random lady with a daughter and say her son is adorable. ',
  'Bring a desk on an elevator. When people try to get on ask if they have an appointment. ',
  'Go to petsmart and buy bird seed. Then ask the clerk how long it will take the birds to grow. ',
  'Come late to school and when the teacher asks why say your pet rock had a seizure. ',
  'Go jump on a random guys back and yell (THE SKY IS FALLING RUN MAN RUN) and see what happens. ',
  'Go to a libary and ask for a book on how to read.',
  'Blow up a balloon, then ask someone to pop it, when they do, start screaming. ',
  'Fill your mouth with whipped cream, then run down the street screaming "I HAVE RABIES". ',
  'Run through a police station and yell " I finally escaped from prison!" .',
  'Make "No Dumping - Violators Will Be Prosecuted" signs and put them in public bathroom stalls. ',
  'Throw a small plastic ball at some body and then yell "get in your ball you stupid pokemon. ',
  'When The Money Comes Out The ATM, Scream "I Won!, I Won!" "I Won!, I Won!" ',
  'Sit on a curb with a stuffed animal and scream at it about how it ruined your life',
  'Go to walmart, find a random old guy and yell, "GRANDPA! YOUR STILL ALIVE! ITS A MIRACLE'
]

exports.generate = () => {
  const name = coolChallenges[Math.floor(Math.random() * 21)]
  const duration = (Math.floor(Math.random() * 1500) + 1) * 1000
  const price = Math.floor(Math.random() * 150) + 1

  return {
    name,
    duration,
    price,
    viewer: {
      nickname: Moniker.choose()
    }
  }
}
