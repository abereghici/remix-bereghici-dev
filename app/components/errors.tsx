import React from 'react'
import clsx from 'clsx'
import errorStack from 'error-stack-parser'
import ResponsiveContainer from './responsive-container'
import {H1, H2, H5, H6, Paragraph} from './typography'

function RedBox({error}: {error: Error}) {
  const [isVisible, setIsVisible] = React.useState(true)
  const frames = errorStack.parse(error)

  return (
    <div
      className={clsx(
        'fixed z-10 inset-0 flex items-center justify-center transition',
        {
          'opacity-0 pointer-events-none': !isVisible,
        },
      )}
    >
      <button
        className="absolute inset-0 block w-full h-full bg-black opacity-75"
        onClick={() => setIsVisible(false)}
      />
      <div className="border-lg text-primary relative mx-5vw my-16 p-12 max-h-75vh bg-red-500 rounded-lg overflow-y-auto">
        <H2>{error.message}</H2>
        <div>
          {frames.map(frame => (
            <div
              key={[frame.fileName, frame.lineNumber, frame.columnNumber].join(
                '-',
              )}
              className="pt-4"
            >
              <H6 as="div" className="pt-2">
                {frame.functionName}
              </H6>
              <div className="font-mono opacity-75">
                {frame.fileName}:{frame.lineNumber}:{frame.columnNumber}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function ErrorPage({
  error,
  errorCode,
  message,
}: {
  error?: Error
  errorCode: string
  message: string
}) {
  return (
    <ResponsiveContainer className="text-center mt-20 mb-20">
      <H1 className="mb-4">{errorCode}</H1>
      <H5 className="text-secondary">{message}</H5>
      {['404', '500'].includes(errorCode) ? (
        <Paragraph className="mb-8 mt-8 text-9xl">
          {errorCode === '500' && <>💣</>}
          {errorCode === '404' && <>🤭</>}
        </Paragraph>
      ) : null}

      {error && process.env.NODE_ENV === 'development' ? (
        <RedBox error={error} />
      ) : null}
    </ResponsiveContainer>
  )
}

function ServerError({error}: {error?: Error}) {
  return (
    <ErrorPage
      error={error}
      errorCode="500"
      message="Oh no, something went wrong."
    />
  )
}

function FourOhFour({error}: {error?: Error}) {
  return (
    <ErrorPage
      error={error}
      errorCode="404"
      message=" Oh no, we can't find the page you're looking for."
    />
  )
}

export {ErrorPage, ServerError, FourOhFour}
