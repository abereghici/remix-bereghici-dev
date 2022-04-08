import React from 'react'
import {motion} from 'framer-motion'
import {Paragraph} from './typography'
import {ClientOnly} from './client-only'

type Props = {
  contentRef: React.RefObject<HTMLElement>
}

function SpeechPost({contentRef}: Props) {
  const [playing, setPlaying] = React.useState(false)
  const [started, setStarted] = React.useState(false)

  const utteranceRef = React.useRef<SpeechSynthesisUtterance>(null)

  const onUtteranceEnd = React.useCallback(() => {
    setStarted(false)
  }, [])

  React.useEffect(() => {
    const utterance = utteranceRef.current
    return () => {
      window.speechSynthesis.cancel()
      utterance?.removeEventListener('end', onUtteranceEnd)
    }
  }, [onUtteranceEnd])

  function play() {
    if (started) {
      window.speechSynthesis.resume()
      setPlaying(true)
    } else {
      if (contentRef.current?.textContent) {
        let utterance = utteranceRef.current

        utterance = new SpeechSynthesisUtterance(contentRef.current.textContent)
        utterance.rate = 1
        utterance.pitch = 0.7
        utterance.volume = 0.8

        window.speechSynthesis.cancel()
        window.speechSynthesis.speak(utterance)

        utterance.addEventListener('end', onUtteranceEnd)

        setStarted(true)
        setPlaying(true)
      }
    }
  }

  function pause() {
    setPlaying(false)
    window.speechSynthesis.pause()
  }

  function onClick() {
    if (playing) {
      pause()
    } else {
      play()
    }
  }

  return (
    <div className="flex items-center">
      <motion.button
        className="flex items-center justify-center w-7 h-7 bg-gray-200 dark:bg-gray-600 rounded-lg hover:ring-2 ring-gray-300"
        onClick={onClick}
      >
        {playing ? <PauseIcon /> : <PlayIcon />}
      </motion.button>
      <p>
        <Paragraph as="div" size="small" variant="secondary" className="ml-2">
          Would you prefer to have this post read to you?
        </Paragraph>
        <Paragraph
          as="div"
          size="small"
          variant="secondary"
          className="ml-2 text-xs"
        >
          SpeechSynthesis is still experimental. This could be buggy
        </Paragraph>
      </p>
    </div>
  )
}

const transition = {
  type: 'spring',
  stiffness: 200,
  damping: 10,
}

const variants = {
  initial: {rotate: 45},
  animate: {rotate: 0, transition},
}

function PlayIcon() {
  return (
    <svg
      viewBox="0 0 330 330"
      stroke="currentColor"
      width={15}
      className="dark:fill-white fill-black"
    >
      <motion.path
        initial="initial"
        animate="animate"
        whileTap="whileTap"
        variants={variants}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        className="gray-200 dark:gray-600"
        d="M37.728,328.12c2.266,1.256,4.77,1.88,7.272,1.88c2.763,0,5.522-0.763,7.95-2.28l240-149.999
	c4.386-2.741,7.05-7.548,7.05-12.72c0-5.172-2.664-9.979-7.05-12.72L52.95,2.28c-4.625-2.891-10.453-3.043-15.222-0.4
	C32.959,4.524,30,9.547,30,15v300C30,320.453,32.959,325.476,37.728,328.12z"
      />
    </svg>
  )
}

function PauseIcon() {
  return (
    <svg
      viewBox="0 0 512 512"
      width={15}
      className="dark:fill-white fill-black"
    >
      <motion.path
        initial="initial"
        animate="animate"
        whileTap="whileTap"
        variants={variants}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M120.16 45A20.162 20.162 0 0 0 100 65.16v381.68A20.162 20.162 0 0 0 120.16 467h65.68A20.162 20.162 0 0 0 206 446.84V65.16A20.162 20.162 0 0 0 185.84 45h-65.68zm206 0A20.162 20.162 0 0 0 306 65.16v381.68A20.162 20.162 0 0 0 326.16 467h65.68A20.162 20.162 0 0 0 412 446.84V65.16A20.162 20.162 0 0 0 391.84 45h-65.68z"
      />
    </svg>
  )
}

export default function SpeechPostWrapper(props: Props) {
  const speechSupported =
    typeof window !== 'undefined' && 'speechSynthesis' in window
  return (
    <ClientOnly fallback={null}>
      {() => (speechSupported ? <SpeechPost {...props} /> : null)}
    </ClientOnly>
  )
}
