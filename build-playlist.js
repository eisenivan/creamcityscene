require('dotenv').config()
const fs = require('fs')
const SpotifyWebApi = require('spotify-web-api-node')
const axios = require('axios')
const querystring = require('querystring')
const get = require('lodash.get')
const set = require('lodash.set')
const sortBy = require('lodash.sortby')
const compact = require('lodash.compact')
const flatten = require('lodash.flatten')
const artistList = require('./list.json')
const showList = require('./site/content/shows/shows.json')

const playlistId = '2a6r9HrB1x3rxBqlhb2qSn'
let authorizationCode = 'TOKEN'
const config = {
  headers: {
    Authorization: authToken
  }
}

function buildPlaylist (arr) {
  const songsPer = Math.floor(70 / arr.length)
  const result = []
  for (let i = 0; i < songsPer; i++) {
    arr.forEach((x) => {
      result.push(x[i])
    })
  }

  return flatten(result)
}

async function auth () {
  try {
    console.log('refresh token')
    const result = await axios.post('https://accounts.spotify.com/api/token', querystring.stringify({ grant_type: 'refresh_token', refresh_token: 'AQDsD0tIxRqa7h7ARMCxIJEfxER4u36paQrpx-Kl3u9IgCIIUOOlX9kaYpG4hh2JXImkfVIYq6ceGeiGOMLu7BRaXADUdI1exMxp8OyNRwh_HqzbSmM1hxxjEdFoYfiaF2k' }), config)
    const { data } = result

    authorizationCode = data.access_token

    const spotifyApi = new SpotifyWebApi({
      clientId: process.env.clientId,
      clientSecret: process.env.clientSecret,
      accessToken: data.access_token
    })

    return spotifyApi
  } catch (e) {
    console.log(e)
  }
}

async function getPlaylist (spotifyApi) {
  try {
    console.log('playlist')
    return spotifyApi.getPlaylist(playlistId)
  } catch (e) {
    console.log(e)
  }
}

async function deleteAllTracks (tracks) {
  try {
    console.log('delete all tracks')
    const res = await axios.delete(
      `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
      {
        headers: {
          Authorization: `Bearer ${authorizationCode}`
        },
        data: {
          tracks
        }
      }
    )

    return res
  } catch (e) {
    console.log(e)
  }
}

async function findArtist (spotifyApi, artist, logText) {
  try {
    console.log(`${artist} (${logText})`)
    const artists = await spotifyApi.searchArtists(artist)

    if (typeof artists.body.artists.items === 'undefined') {
      console.log('NOT FOUND!')
    }

    return get(artists.body.artists.items.find(x => x.name === artist), 'id', get(artists, 'body.artists.items[0].id'))
  } catch (e) {
    console.log('FIND ARTIST ERROR', e)
  }
}

function timer (ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function findArtists (spotifyApi, artistList) {
  try {
    console.log('find artists')
    if (artistList.length > 0) {
      // trottled
      const promises = []
      for (let i = 0; i < artistList.length; i++) {
        promises.push(findArtist(spotifyApi, artistList[i], `${i + 1} of ${artistList.length}`))
        await timer(200)
      }

      return Promise.all(promises)
    }
  } catch (e) {
    console.log(e)
  }

  return false
}

async function addTracks (songs) {
  try {
    console.log('add tracks')
    const res = await axios.post(
      `https://api.spotify.com/v1/playlists/${playlistId}/tracks?uris=${encodeURIComponent(songs.join(','))}`,
      null,
      {
        headers: {
          Authorization: `Bearer ${authorizationCode}`
        }
      }
    )

    return res
  } catch (e) {
    console.log(e)
  }
}

function sortTopTracksByPopularity (arr) {
  return sortBy(arr, o => get(o, 'body.tracks[0].popularity', 0)).reverse()
}

function sortArtistsByPopularity (arr) {
  return sortBy(arr, o => get(o, 'popularity', 0)).reverse()
}

function mergeShowInfo (artistInfo) {
  console.log('merge show info')
  return artistInfo.map((x) => {
    const artist = get(x, 'name')
    showList.forEach((show) => {
      const performances = get(show, 'performance', [])

      if (performances.find(performance => performance.artist.displayName === artist)) {
        set(x, 'performance', show.performance)
        set(x, 'start', show.start)
      }
    })

    return x
  })
}

async function refreshPlaylist () {
  try {
    const spotifyApi = await auth()
    const list = await getPlaylist(spotifyApi)

    const tracks = list.body.tracks.items
      .map((x, i) => ({ uri: x.track.uri, positions: [i] }))

    if (tracks.length > 0) {
      await deleteAllTracks(tracks)
    }

    const artists = compact(await findArtists(spotifyApi, artistList))
    const topTracks = await Promise.all(artists.map(async (x) => {
      await timer(100)
      return spotifyApi.getArtistTopTracks(x, 'US')
    }))

    // build artist data cache
    const pages = Math.ceil(artists.length / 50)
    const artistArr = []

    for (let i = 0; i < pages; i++) {
      let res = await axios.get(
        `https://api.spotify.com/v1/artists?ids=${artists.slice(i + (i * 50), (i + 1) * 50).join(',')}`,
        {
          headers: {
            Authorization: `Bearer ${authorizationCode}`
          }
        }
      )

      artistArr.push(res.data.artists)
    }

    const artistInfo = flatten(artistArr)

    // merge event details
    const artistInfoWithShows = mergeShowInfo(artistInfo)

    fs.writeFileSync('./site/content/artistinfo/artistinfo.json', JSON.stringify(sortArtistsByPopularity(artistInfoWithShows), null, 2))

    const finalSongs = buildPlaylist(
      sortTopTracksByPopularity(topTracks)
        .map(x => x.body.tracks
          .map(y => y.uri))
        .slice(0, 69)
    )

    await addTracks(compact(finalSongs))
  } catch (e) {
    console.log(e)
  }
}

refreshPlaylist()
