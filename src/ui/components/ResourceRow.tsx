interface ResourceRowProps {
  label: string
  value: number | string
  max?: number
  unit?: string
}

export function ResourceRow({ label, value, max, unit }: ResourceRowProps) {
  const display =
    typeof value === 'number'
      ? max !== undefined
        ? `${Math.floor(value)} / ${max}`
        : Math.floor(value).toString()
      : value

  return (
    <div className="resource-row">
      <span className="resource-row__label">{label}</span>
      <span className="resource-row__value">
        {display}
        {unit && <span className="dim"> {unit}</span>}
      </span>
    </div>
  )
}
