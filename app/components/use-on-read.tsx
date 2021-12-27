import * as React from 'react'

export default function useOnRead({
  parentElRef,
  time,
  onRead,
}: {
  parentElRef: React.RefObject<HTMLElement>
  time: number | undefined
  onRead: () => void
}) {
  React.useEffect(() => {
    const parentEl = parentElRef.current
    if (!parentEl || !time) return

    const visibilityEl = document.createElement('div')

    let scrolledTheMain = false
    const observer = new IntersectionObserver(entries => {
      const isVisible = entries.some(entry => {
        return entry.target === visibilityEl && entry.isIntersecting
      })
      if (isVisible) {
        scrolledTheMain = true
        maybeMarkAsRead()
        observer.disconnect()
        visibilityEl.remove()
      }
    })

    let startTime = new Date().getTime()
    let timeoutTime = time * 0.3
    let timerId: ReturnType<typeof setTimeout>
    let timerFinished = false
    function startTimer() {
      timerId = setTimeout(() => {
        timerFinished = true
        document.removeEventListener('visibilitychange', handleVisibilityChange)
        maybeMarkAsRead()
      }, timeoutTime)
    }

    function handleVisibilityChange() {
      if (document.hidden) {
        clearTimeout(timerId)
        const timeElapsedSoFar = new Date().getTime() - startTime
        timeoutTime = timeoutTime - timeElapsedSoFar
      } else {
        startTime = new Date().getTime()
        startTimer()
      }
    }

    function maybeMarkAsRead() {
      if (timerFinished && scrolledTheMain) {
        cleanup()
        onRead()
      }
    }

    // dirty-up
    parentEl.append(visibilityEl)
    observer.observe(visibilityEl)
    startTimer()
    document.addEventListener('visibilitychange', handleVisibilityChange)

    function cleanup() {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      clearTimeout(timerId)
      observer.disconnect()
      visibilityEl.remove()
    }
    return cleanup
  }, [time, onRead, parentElRef])
}
