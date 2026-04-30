/**
 * Logs a success message to the console.
 * @param {string} message The message to log
 */
export function success(message) {
  console.log(`✅ ${message}`);
}

/**
 * Logs an error message to the console.
 * @param {string} message The message to log
 */
export function error(message) {
  console.error(`❌ ${message}`);
}

export default {
  success,
  error,
};
