import type {NowPlayingSong} from '~/types'

const client_id = process.env.SPOTIFY_CLIENT_ID
const client_secret = process.env.SPOTIFY_CLIENT_SECRET
const refresh_token = process.env.SPOTIFY_REFRESH_TOKEN ?? ''

const basic = Buffer.from(`${client_id}:${client_secret}`).toString('base64')
const NOW_PLAYING_ENDPOINT = `https://api.spotify.com/v1/me/player/currently-playing`
const TOP_TRACKS_ENDPOINT = `https://api.spotify.com/v1/me/top/tracks`
const TOKEN_ENDPOINT = `https://accounts.spotify.com/api/token`

async function getAccessToken() {
  const response = await fetch(TOKEN_ENDPOINT, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${basic}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token,
    }).toString(),
  })

  return response.json()
}

async function getNowPlaying() {
  const {access_token} = await getAccessToken()

  return fetch(NOW_PLAYING_ENDPOINT, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  })
    .then(data => data.json())
    .then(
      data =>
        ({
          isPlaying: data.is_playing,
          songUrl: data.item?.external_urls?.spotify,
          title: data.item?.name,
          artist: data.item?.artists
            ?.map((artist: {name: string}) => artist.name)
            .join(', '),
          album: data.item?.album?.name,
          albumImageUrl: data.item?.album?.images?.[0]?.url,
        } as NowPlayingSong),
    )
}

async function getTopTracks() {
  const {access_token} = await getAccessToken()

  return fetch(TOP_TRACKS_ENDPOINT, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  })
}

export {getNowPlaying, getTopTracks}
