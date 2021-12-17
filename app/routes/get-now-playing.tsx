import {json, LoaderFunction} from 'remix'
import type {AppHandle, NowPlayingSong} from '~/types'
import {getNowPlaying} from '~/utils/spotify.server'

export const handle: AppHandle = {
  getSitemapEntries: () => null,
}

export const loader: LoaderFunction = async () => {
  let song: NowPlayingSong | null = null

  try {
    song = await getNowPlaying()
  } catch (e: unknown) {
    console.error(e)
  }

  return json({song})
}
