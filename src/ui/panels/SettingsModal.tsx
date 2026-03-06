import { useRef, useState } from 'react'
import { useSettingsStore, TEXT_SPEED_CPS } from '../../core/state/settingsState'
import type { TextSpeed } from '../../core/state/settingsState'
import { exportSave, importSave, resetAllSaves } from '../../core/saveBackup'
import '../../styles/settings.css'

interface SettingsModalProps {
  onClose: () => void
}

export function SettingsModal({ onClose }: SettingsModalProps) {
  const { textSpeed, masterVolume, reduceMotion, set } = useSettingsStore()
  const [feedback, setFeedback] = useState<{ msg: string; error?: boolean } | null>(null)
  const [confirmReset, setConfirmReset] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  function showFeedback(msg: string, error = false) {
    setFeedback({ msg, error })
    setTimeout(() => setFeedback(null), 3000)
  }

  function handleExport() {
    exportSave()
    showFeedback('Save exported.')
  }

  function handleImportClick() {
    fileInputRef.current?.click()
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const result = await importSave(file)
    if (result.success) {
      showFeedback('Save imported. Reloading...')
      setTimeout(() => window.location.reload(), 1200)
    } else {
      showFeedback(result.error ?? 'Import failed.', true)
    }
    e.target.value = ''
  }

  function handleReset() {
    if (!confirmReset) {
      setConfirmReset(true)
      setTimeout(() => setConfirmReset(false), 4000)
      return
    }
    resetAllSaves()
    window.location.reload()
  }

  // Close on overlay click
  function handleOverlayClick(e: React.MouseEvent) {
    if (e.target === e.currentTarget) onClose()
  }

  const TEXT_SPEEDS: TextSpeed[] = ['slow', 'normal', 'fast', 'instant']

  return (
    <div className="settings-overlay" onClick={handleOverlayClick}>
      <div className="settings-modal">
        <div className="settings-modal__header">
          <span className="settings-modal__title">Settings</span>
          <button className="settings-modal__close" onClick={onClose}>[ X ]</button>
        </div>

        <div className="settings-modal__body">

          {/* Text speed */}
          <div className="settings-row">
            <div className="settings-row__label">Text Speed</div>
            <div className="settings-group">
              {TEXT_SPEEDS.map((speed) => (
                <button
                  key={speed}
                  className={`settings-group__btn${textSpeed === speed ? ' settings-group__btn--active' : ''}`}
                  onClick={() => set({ textSpeed: speed })}
                >
                  {speed}
                </button>
              ))}
            </div>
            <div className="settings-row__desc">
              {TEXT_SPEED_CPS[textSpeed] >= 9999 ? 'Text appears immediately.' : `${TEXT_SPEED_CPS[textSpeed]} chars/sec`}
            </div>
          </div>

          {/* Volume */}
          <div className="settings-row">
            <div className="settings-row__label">Master Volume — {Math.round(masterVolume * 100)}%</div>
            <input
              type="range"
              className="settings-slider"
              min={0}
              max={1}
              step={0.05}
              value={masterVolume}
              onChange={(e) => set({ masterVolume: parseFloat(e.target.value) })}
            />
            <div className="settings-row__desc">Audio not yet active — saved for when sound is wired up.</div>
          </div>

          {/* Reduce motion */}
          <div className="settings-row">
            <div className="settings-row__label">Accessibility</div>
            <label className="settings-toggle" onClick={() => set({ reduceMotion: !reduceMotion })}>
              <div className="settings-toggle__box">{reduceMotion ? 'X' : ''}</div>
              <span className="settings-toggle__label">Reduce motion</span>
            </label>
            <div className="settings-row__desc">Disables panel reveal animations and noise glitch effects.</div>
          </div>

          <div className="settings-divider" />

          {/* Save backup */}
          <div className="settings-row">
            <div className="settings-row__label">Save Data</div>
            <button className="settings-action-btn" onClick={handleExport}>
              [ EXPORT SAVE ] — download as .json
            </button>
            <button className="settings-action-btn" onClick={handleImportClick}>
              [ IMPORT SAVE ] — restore from .json
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />
            {feedback && (
              <div className={`settings-feedback${feedback.error ? ' settings-feedback--error' : ''}`}>
                {feedback.msg}
              </div>
            )}
          </div>

          {/* Reset */}
          <div className="settings-row">
            <button className="settings-danger-btn" onClick={handleReset}>
              {confirmReset
                ? '[ CONFIRM — THIS CANNOT BE UNDONE ]'
                : '[ RESET ALL SAVES ] — wipe everything'}
            </button>
          </div>

          {/* Donate placeholder */}
          <div className="settings-donate">
            <span style={{ color: 'var(--fg-dim)' }}>
              {/* Donate link goes here when ready */}
              support the project — donate link coming soon
            </span>
          </div>

        </div>
      </div>
    </div>
  )
}
