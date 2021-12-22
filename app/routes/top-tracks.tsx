import * as React from 'react'
import {json, LoaderFunction, useLoaderData} from 'remix'
import {getServerTimeHeader, Timings} from '~/utils/metrics.server'
import {ServerError} from '~/components/errors'
import {H1, Paragraph} from '~/components/typography'
import ResponsiveContainer from '~/components/responsive-container'
import type {SpotifySong} from '~/types'
import {getTopTracksCached} from '~/utils/spotify.server'
import TrackItem from '~/components/track-item'

type LoaderData = {
  tracks: SpotifySong[]
}

export const loader: LoaderFunction = async ({request}) => {
  const timings: Timings = {}

  const tracks = await getTopTracksCached({
    request,
    timings,
  })
  const data: LoaderData = {tracks}
  return json(data, {
    headers: {
      'Server-Timing': getServerTimeHeader(timings),
    },
  })
}

export default function Index() {
  const {tracks} = useLoaderData<LoaderData>()

  return (
    <ResponsiveContainer>
      <H1 className="mb-2 w-full tracking-tight">Top Tracks</H1>
      <Paragraph variant="secondary" className="mb-4">
        Here's my top tracks on Spotify updated daily
      </Paragraph>
      {tracks.map((track, index) => (
        <TrackItem key={track.songUrl} item={track} index={index} />
      ))}
    </ResponsiveContainer>
  )
}

export function ErrorBoundary({error}: {error: Error}) {
  console.error(error)
  return <ServerError error={error} />
}
