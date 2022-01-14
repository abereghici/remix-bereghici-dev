import type {SpotifySong} from '~/types'
import {cachified, CachifiedOptions} from './cache.server'
import {redisCache} from './redis.server'

const client_id = process.env.SPOTIFY_CLIENT_ID
const client_secret = process.env.SPOTIFY_CLIENT_SECRET
const refresh_token = process.env.SPOTIFY_REFRESH_TOKEN ?? ''

const basic = Buffer.from(`${client_id}:${client_secret}`).toString('base64')
const NOW_PLAYING_ENDPOINT = `https://api.spotify.com/v1/me/player/currently-playing`
const TOP_TRACKS_ENDPOINT = `https://api.spotify.com/v1/me/top/tracks?limit=50&time_range=short_term`
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
        } as SpotifySong),
    )
    .catch(() => null)
}

async function getTopTracks() {
  const {access_token} = await getAccessToken()

  return fetch(TOP_TRACKS_ENDPOINT, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  })
    .then(data => data.json())
    .then(data =>
      data.items.map(
        (songData: any) =>
          ({
            songUrl: songData.external_urls?.spotify,
            title: songData.name,
            artist: songData.artists
              ?.map((artist: {name: string}) => artist.name)
              .join(', '),
            album: songData.album?.name,
            albumImageUrl: songData.album?.images?.[0]?.url,
          } as SpotifySong),
      ),
    )
    .catch(() => [] as SpotifySong[])
}

async function getTopTracksCached(options?: CachifiedOptions) {
  const maxAge = 11000 * 60 * 60 * 4 // 4 hours

  return cachified({
    cache: redisCache,
    maxAge,
    ...options,
    key: `spotify-top-tracks`,
    checkValue: (value: unknown) => Array.isArray(value),
    getFreshValue: async () => {
      try {
        const tracks = await getTopTracks()

        return tracks
      } catch (e: unknown) {
        console.warn(e)
      }

      return []
    },
  })
}

export {getNowPlaying, getTopTracksCached}
