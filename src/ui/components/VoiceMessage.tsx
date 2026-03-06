import { useState, useEffect, useRef } from 'react'
import { useSettingsStore, TEXT_SPEED_CPS } from '../../core/state/settingsState'

interface VoiceMessageProps {
  lines: string[]
  isVoice?: boolean
  onComplete?: () => void
}

export function VoiceMessage({ lines, isVoice = true, onComplete }: VoiceMessageProps) {
  const fullText = lines.join('\n')
  const charsPerSec = useSettingsStore((s) => TEXT_SPEED_CPS[s.textSpeed])
  const [displayed, setDisplayed] = useState('')
  const [done, setDone] = useState(false)
  const indexRef = useRef(0)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    indexRef.current = 0
    setDisplayed('')
    setDone(false)

    // Instant mode: show all at once
    if (charsPerSec >= 9999) {
      setDisplayed(fullText)
      setDone(true)
      onComplete?.()
      return
    }

    const interval = Math.round(1000 / charsPerSec)
    intervalRef.current = setInterval(() => {
      indexRef.current += 1
      setDisplayed(fullText.slice(0, indexRef.current))
      if (indexRef.current >= fullText.length) {
        clearInterval(intervalRef.current!)
        intervalRef.current = null
        setDone(true)
        onComplete?.()
      }
    }, interval)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fullText, charsPerSec])

  return (
    <div className={`radio-log__entry${isVoice ? '' : ' radio-log__entry--system'}`}>
      {displayed.split('\n').map((line, i) => (
        <div key={i}>{line || <>&nbsp;</>}</div>
      ))}
      {!done && <span className="typewriter-cursor" />}
    </div>
  )
}
