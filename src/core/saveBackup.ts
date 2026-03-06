const SAVE_KEYS = ['deadline-run-state', 'deadline-meta-state', 'deadline-settings']

export interface SaveBackup {
  version: 1
  exportedAt: string
  data: Record<string, unknown>
}

export function exportSave(): void {
  const backup: SaveBackup = {
    version: 1,
    exportedAt: new Date().toISOString(),
    data: {},
  }

  for (const key of SAVE_KEYS) {
    const raw = localStorage.getItem(key)
    if (raw) {
      try {
        backup.data[key] = JSON.parse(raw)
      } catch {
        backup.data[key] = raw
      }
    }
  }

  const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  const date = new Date().toISOString().slice(0, 10)
  a.href = url
  a.download = `deadline-save-${date}.json`
  a.click()
  URL.revokeObjectURL(url)
}

export function importSave(file: File): Promise<{ success: boolean; error?: string }> {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string
        const backup = JSON.parse(text) as SaveBackup

        if (backup.version !== 1 || !backup.data) {
          resolve({ success: false, error: 'Unrecognized save format.' })
          return
        }

        for (const key of SAVE_KEYS) {
          if (backup.data[key] !== undefined) {
            localStorage.setItem(key, JSON.stringify(backup.data[key]))
          }
        }

        resolve({ success: true })
      } catch {
        resolve({ success: false, error: 'Could not parse save file.' })
      }
    }
    reader.onerror = () => resolve({ success: false, error: 'Could not read file.' })
    reader.readAsText(file)
  })
}

export function resetAllSaves(): void {
  for (const key of SAVE_KEYS) {
    localStorage.removeItem(key)
  }
}
