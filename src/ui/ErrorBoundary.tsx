import { Component } from 'react'
import type { ReactNode, ErrorInfo } from 'react'

interface Props { children: ReactNode }
interface State { error: Error | null }

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  componentDidCatch(_error: Error, info: ErrorInfo) {
    console.error('[DEAD LINE] render error:', _error, info)
  }

  render() {
    if (this.state.error) {
      return (
        <div style={{
          background: '#080808', color: '#c8c8c8',
          fontFamily: 'IBM Plex Mono, monospace', padding: '40px',
          minHeight: '100vh', whiteSpace: 'pre-wrap',
        }}>
          {`SECTOR 7 MONITORING CONSOLE\n============================\n\nERROR — SYSTEM FAULT\n\n${this.state.error.message}\n\n`}
          <button
            onClick={() => { localStorage.clear(); window.location.reload() }}
            style={{ background: 'none', border: '1px solid #444', color: '#c8c8c8', fontFamily: 'inherit', padding: '4px 12px', cursor: 'pointer' }}
          >
            [ CLEAR SAVE AND RELOAD ]
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
