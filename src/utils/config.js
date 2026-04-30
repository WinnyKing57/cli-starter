import fs from "fs";
import path from "path";
import os from "os";

const CONFIG_FILE = path.join(os.homedir(), ".cli-starter.json");

/**
 * Reads the configuration from ~/.cli-starter.json
 * @returns {Object}
 */
export function readConfig() {
  if (!fs.existsSync(CONFIG_FILE)) {
    return {};
  }
  try {
    const content = fs.readFileSync(CONFIG_FILE, "utf8");
    return JSON.parse(content);
  } catch {
    return {};
  }
}

/**
 * Writes the configuration to ~/.cli-starter.json
 * @param {Object} config
 */
export function writeConfig(config) {
  try {
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2), "utf8");
  } catch {
    // Fail silently
  }
}

export default {
  readConfig,
  writeConfig,
};
