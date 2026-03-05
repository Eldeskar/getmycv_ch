import { parsePhoneNumberFromString } from 'libphonenumber-js'

/**
 * Format a phone number according to its country prefix.
 * Returns the international format (e.g. "+41 79 123 45 67") if a valid
 * country prefix is detected, otherwise returns the input unchanged.
 */
export function formatPhone(raw: string): string {
  if (!raw) return raw
  const trimmed = raw.trim()
  if (!trimmed) return trimmed

  const phone = parsePhoneNumberFromString(trimmed)
  if (phone && phone.isValid()) {
    return phone.formatInternational()
  }

  return trimmed
}
