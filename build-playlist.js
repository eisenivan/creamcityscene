const fs = require('fs')
const SpotifyWebApi = require('spotify-web-api-node')
const axios = require('axios')
const querystring = require('querystring')
const get = require('lodash.get')
const sortBy = require('lodash.sortby')
const compact = require('lodash.compact')
const flatten = require('lodash.flatten')
const artistList = require('./list-this-week.json')

const playlistId = '2a6r9HrB1x3rxBqlhb2qSn'
let authorizationCode = 'TOKEN'
const config = {
  headers: {
    Authorization: 'Basic YmMzOTI2MmYzOWZkNDNkM2EzNTVmNDY5YjdiMjEzYmU6ZjI1YjFkZGUxMGUxNDY4ODg4MGQ0YzkxZTFkMzk4NDc='
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
    const result = await axios.post('https://accounts.spotify.com/api/token', querystring.stringify({ grant_type: 'refresh_token', refresh_token: 'AQDsD0tIxRqa7h7ARMCxIJEfxER4u36paQrpx-Kl3u9IgCIIUOOlX9kaYpG4hh2JXImkfVIYq6ceGeiGOMLu7BRaXADUdI1exMxp8OyNRwh_HqzbSmM1hxxjEdFoYfiaF2k' }), config)
    const { data } = result

    authorizationCode = data.access_token

    const spotifyApi = new SpotifyWebApi({
      clientId: 'bc39262f39fd43d3a355f469b7b213be',
      clientSecret: 'f25b1dde10e14688880d4c91e1d39847',
      accessToken: data.access_token
    })

    return spotifyApi
  } catch (e) {
    console.log(e)
  }
}

async function getPlaylist (spotifyApi) {
  return spotifyApi.getPlaylist(playlistId)
}

async function deleteAllTracks (tracks) {
  try {
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

async function findArtist (spotifyApi, artist) {
  const artists = await spotifyApi.searchArtists(artist)
  return get(artists.body.artists.items.find(x => x.name === artist), 'id')
}

async function findArtists (spotifyApi, artistList) {
  if (artistList.length > 0) {
    return Promise.all(artistList.map(async x => findArtist(spotifyApi, x)))
  }

  return false
}

async function addTracks (songs) {
  try {
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
  return sortBy(arr, o => get(o.body.tracks[0], 'popularity', 0)).reverse()
}

function sortArtistsByPopularity (arr) {
  return sortBy(arr, o => get(o.body, 'popularity', 0)).reverse()
}

async function refreshPlaylist () {
  const spotifyApi = await auth()
  const list = await getPlaylist(spotifyApi)

  const tracks = list.body.tracks.items
    .map((x, i) => ({ uri: x.track.uri, positions: [i] }))

  if (tracks.length > 0) {
    await deleteAllTracks(tracks)
  }

  const artists = compact(await findArtists(spotifyApi, artistList))
  const topTracks = await Promise.all(artists.map(async x => spotifyApi.getArtistTopTracks(x, 'US')))

  // build artist data cache
  const artistInfo = await Promise.all(artists.map(async x => spotifyApi.getArtist(x)))
  fs.writeFileSync('./site/content/artistinfo/artistinfo.json', JSON.stringify(sortArtistsByPopularity(artistInfo), null, 2))

  const finalSongs = buildPlaylist(
    sortTopTracksByPopularity(topTracks)
      .map(x => x.body.tracks
        .map(y => y.uri))
  )

  await addTracks(compact(finalSongs))
}

refreshPlaylist()
