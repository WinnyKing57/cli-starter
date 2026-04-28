const fs = require("fs");
const path = require("path");

/**
 * Checks if a buffer is likely binary.
 * @param {Buffer} buffer
 * @returns {boolean}
 */
function isBinary(buffer) {
  const checkLimit = Math.min(buffer.length, 1024);
  for (let i = 0; i < checkLimit; i++) {
    if (buffer[i] === 0) return true;
  }
  return false;
}

/**
 * Copies a directory recursively and replaces variables in file contents.
 * @param {string} src Source directory path
 * @param {string} dest Destination directory path
 * @param {Object} variables Object containing variables to replace
 */
function copyDir(src, dest, variables) {
  fs.mkdirSync(dest, { recursive: true });

  const entries = fs.readdirSync(src);

  for (const entry of entries) {
    const srcPath = path.join(src, entry);
    const destPath = path.join(dest, entry);

    const stat = fs.statSync(srcPath);

    if (stat.isDirectory()) {
      copyDir(srcPath, destPath, variables);
    } else {
      const buffer = fs.readFileSync(srcPath);

      if (isBinary(buffer)) {
        fs.writeFileSync(destPath, buffer);
      } else {
        let content = buffer.toString("utf8");

        // Replace all variables in the format {{variable_name}}
        for (const [key, value] of Object.entries(variables)) {
          content = content.split(`{{${key}}}`).join(value);
        }

        fs.writeFileSync(destPath, content);
      }
    }
  }
}

module.exports = {
  copyDir,
};
