// Input validation utility functions

/**
 * Validates email format
 * @param email - Email to validate
 * @returns True if valid email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Validates password strength
 * @param password - Password to validate
 * @returns True if password meets requirements
 */
export function isValidPassword(password: string): boolean {
  // At least 8 characters
  return password.length >= 8
}

/**
 * Validates username format
 * @param username - Username to validate
 * @returns True if valid username format
 */
export function isValidUsername(username: string): boolean {
  // 3-20 characters, alphanumeric and underscore only
  const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/
  return usernameRegex.test(username)
}

/**
 * Validates amount is positive number
 * @param amount - Amount to validate
 * @returns True if positive number
 */
export function isValidAmount(amount: number): boolean {
  return !isNaN(amount) && amount > 0
}

/**
 * Validates account has sufficient balance for withdrawal
 * @param balance - Current account balance
 * @param amount - Amount to withdraw
 * @returns True if sufficient balance
 */
export function hasSufficientBalance(balance: number, amount: number): boolean {
  return balance >= amount
}

/**
 * Validates date string is in future
 * @param dateString - Date string to validate
 * @returns True if date is in future
 */
export function isFutureDate(dateString: string): boolean {
  const date = new Date(dateString)
  const now = new Date()
  return date > now
}
