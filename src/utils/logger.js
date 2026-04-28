/**
 * Logs a success message to the console.
 * @param {string} message The message to log
 */
function success(message) {
  console.log(`✅ ${message}`);
}

/**
 * Logs an error message to the console.
 * @param {string} message The message to log
 */
function error(message) {
  console.error(`❌ ${message}`);
}

module.exports = {
  success,
  error,
};
