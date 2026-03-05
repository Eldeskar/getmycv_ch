/** Format a YYYY-MM date string to a human-readable short date */
export function formatDate(value: string): string {
  if (!value) return ''
  try {
    const [year, month] = value.split('-')
    if (!month) return year
    const date = new Date(Number(year), Number(month) - 1)
    return date.toLocaleDateString('en', { month: 'short', year: 'numeric' })
  } catch {
    return value
  }
}
