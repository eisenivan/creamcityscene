const axios = require('axios')
const fs = require('fs')
const uniq = require('lodash.uniq')
const get = require('lodash.get')
const flatten = require('lodash.flatten')
const moment = require('moment')

const today = moment().format('YYYY-MM-DD')
const thisWeek = moment().add(7, 'days').format('YYYY-MM-DD')

axios.get(`https://api.songkick.com/api/3.0/metro_areas/15405-us-milwaukee/calendar.json?apikey=lUMYaWAtyzEue1rK&min_date=${today}&max_date=${thisWeek}`)
  .then(({ data }) => {
    fs.writeFileSync('./site/content/shows/shows.json', JSON.stringify(data.resultsPage.results.event))
    const reduced = uniq(flatten(get(data, 'resultsPage.results.event', []).map(x => x.performance.map(y => y.artist.displayName))))
    fs.writeFileSync('./list.json', JSON.stringify(reduced, null, 2))
    console.log(`Cached ${reduced.length} artists!`)
  }, (e) => {
    console.log(e)
  })
