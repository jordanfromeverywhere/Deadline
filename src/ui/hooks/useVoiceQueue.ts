import { useState, useEffect, useCallback } from 'react'
import { useRunStore } from '../../core/state/runState'
import type { RadioEntry } from '../../core/state/types'

/**
 * Drains the voice message queue one entry at a time,
 * appending completed messages to the radio log.
 *
 * Returns whether a message is currently being displayed (for cursor logic).
 */
export function useVoiceQueue() {
  const [isPlaying, setIsPlaying] = useState(false)

  const queue = useRunStore((s) => s.voiceMessageQueue)
  const set = useRunStore((s) => s.set)
  const gameTime = useRunStore((s) => s.gameTime)

  const dequeueNext = useCallback(() => {
    const current = useRunStore.getState()
    if (current.voiceMessageQueue.length === 0) {
      setIsPlaying(false)
      return
    }

    const [next, ...remaining] = current.voiceMessageQueue
    if (!next) return

    const entry: RadioEntry = {
      id: `entry_${Date.now()}_${Math.random()}`,
      lines: next.lines,
      timestamp: current.gameTime,
      isVoice: true,
    }

    set({
      voiceMessageQueue: remaining,
      radioLog: [...current.radioLog, entry],
      shownVoiceMessageIds: current.shownVoiceMessageIds.includes(next.id)
        ? current.shownVoiceMessageIds
        : [...current.shownVoiceMessageIds, next.id],
      lastVoiceMessageAt: current.gameTime,
      voiceMessageCooldowns: {
        ...current.voiceMessageCooldowns,
        [next.id]: current.gameTime,
      },
    })
  }, [set])

  // When queue has items and we're not playing, start playing
  useEffect(() => {
    if (!isPlaying && queue.length > 0) {
      setIsPlaying(true)
      dequeueNext()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queue.length, isPlaying])

  // This is called by VoiceMessage when typewriter finishes
  const onMessageComplete = useCallback(() => {
    // Small delay between messages
    setTimeout(() => {
      const current = useRunStore.getState()
      if (current.voiceMessageQueue.length > 0) {
        dequeueNext()
      } else {
        setIsPlaying(false)
      }
    }, 400)
  }, [dequeueNext])

  return { isPlaying, onMessageComplete, gameTime }
}
