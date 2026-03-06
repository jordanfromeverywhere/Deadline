interface ActionButtonProps {
  label: string
  onClick: () => void
  disabled?: boolean
  cooldown?: boolean
  title?: string
}

export function ActionButton({ label, onClick, disabled, cooldown, title }: ActionButtonProps) {
  return (
    <button
      className={`action-button${cooldown ? ' action-button--cooldown' : ''}`}
      onClick={onClick}
      disabled={disabled || cooldown}
      title={title}
    >
      [ {label} ]
    </button>
  )
}
