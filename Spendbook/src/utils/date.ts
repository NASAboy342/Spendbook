// Date utility functions with UTC handling

/**
 * Converts a local Date object to UTC timestamp string
 * @param date - Local date object
 * @returns ISO 8601 UTC timestamp string
 */
export function toUTC(date: Date): string {
  return date.toISOString()
}

/**
 * Converts UTC timestamp string to local Date object
 * @param utcString - ISO 8601 UTC timestamp string
 * @returns Local Date object
 */
export function fromUTC(utcString: string): Date {
  return new Date(utcString)
}

/**
 * Gets current UTC timestamp as ISO string
 * @returns Current UTC timestamp
 */
export function nowUTC(): string {
  return new Date().toISOString()
}

/**
 * Formats a UTC timestamp for display in local timezone
 * @param utcString - ISO 8601 UTC timestamp string
 * @param format - Display format ('date', 'datetime', 'time')
 * @returns Formatted date string in local timezone
 */
export function formatDate(
  utcString: string,
  format: 'date' | 'datetime' | 'time' = 'datetime'
): string {
  const date = fromUTC(utcString)
  
  switch (format) {
    case 'date':
      return date.toLocaleDateString()
    case 'time':
      return date.toLocaleTimeString()
    case 'datetime':
    default:
      return date.toLocaleString()
  }
}

/**
 * Converts local date string (YYYY-MM-DD) to UTC timestamp
 * @param dateString - Local date string
 * @returns UTC timestamp at start of day
 */
export function dateStringToUTC(dateString: string): string {
  const date = new Date(dateString)
  return toUTC(date)
}

/**
 * Gets UTC timestamp for start of day (00:00:00)
 * @param date - Optional date (defaults to today)
 * @returns UTC timestamp at start of day
 */
export function startOfDayUTC(date: Date = new Date()): string {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  return toUTC(d)
}

/**
 * Gets UTC timestamp for end of day (23:59:59.999)
 * @param date - Optional date (defaults to today)
 * @returns UTC timestamp at end of day
 */
export function endOfDayUTC(date: Date = new Date()): string {
  const d = new Date(date)
  d.setHours(23, 59, 59, 999)
  return toUTC(d)
}
