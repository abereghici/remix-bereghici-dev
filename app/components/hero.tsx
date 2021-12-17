import * as React from 'react'
import {H1, Paragraph} from '~/components/typography'

export default function Hero() {
  return (
    <div className="flex flex-col-reverse items-start sm:flex-row">
      <div className="flex flex-col pr-8">
        <H1>Alexandru Bereghici</H1>
        <Paragraph className="mb-16 mt-4" variant="secondary" size="large">
          Software engineer specializing in JavaScript ecosystem.
        </Paragraph>
      </div>
      <div className="w-[80px] sm:w-[176px] relative mb-8 mr-auto sm:mb-0">
        <img
          alt="Alexandru Bereghici"
          height={176}
          width={176}
          src="/avatar.jpeg"
          className="rounded-full ring-4 ring-green-100"
        />
      </div>
    </div>
  )
}
