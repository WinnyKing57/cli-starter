import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { execFileSync } from "child_process";
import inquirer from "inquirer";
import { dir } from "tmp-promise";
import { copyDir } from "../core/templateEngine.js";
import logger from "../utils/logger.js";
import config from "../utils/config.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Checks if a command is available in the system.
 * @param {string} command
 * @returns {boolean}
 */
function isCommandAvailable(command) {
  try {
    execFileSync(command, ["--version"], { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}

/**
 * Validates if a string is a git URL.
 * @param {string} url
 * @returns {boolean}
 */
function isGitUrl(url) {
  return (
    typeof url === "string" &&
    (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("git@"))
  );
}

export default async function (type, name, options = {}) {
  const templatesPath = path.join(__dirname, "../../templates");
  const availableTemplates = fs
    .readdirSync(templatesPath)
    .filter((file) => fs.statSync(path.join(templatesPath, file)).isDirectory());

  let projectType = type;
  let projectName = name;
  let templatePath;
  let cleanup;

  // Handle external template
  if (options.template) {
    if (isGitUrl(options.template)) {
      if (!isCommandAvailable("git")) {
        logger.error("Git n'est pas installé. Impossible de cloner le template externe.");
        process.exit(1);
      }
      logger.success(`Clonage du template externe : ${options.template}...`);
      try {
        const tmpDir = await dir({ unsafeCleanup: true });
        cleanup = tmpDir.cleanup;
        execFileSync("git", ["clone", options.template, "."], {
          cwd: tmpDir.path,
          stdio: "ignore",
        });
        templatePath = tmpDir.path;
      } catch (err) {
        logger.error(`Erreur lors du clonage du template : ${err.message}`);
        process.exit(1);
      }
    } else {
      templatePath = path.resolve(options.template);
    }
  }

  // Interactive mode if arguments are missing
  if (!projectName || (!templatePath && !projectType)) {
    const answers = await inquirer.prompt([
      {
        type: "list",
        name: "type",
        message: "Quel type de projet voulez-vous créer ?",
        choices: availableTemplates,
        when: !templatePath && !projectType,
      },
      {
        type: "input",
        name: "name",
        message: "Quel est le nom de votre projet ?",
        default: "my-project",
        when: !projectName,
      },
    ]);

    projectType = projectType || answers.type;
    projectName = projectName || answers.name;
  }

  if (!templatePath) {
    templatePath = path.join(templatesPath, projectType);
  }

  const targetPath = path.join(process.cwd(), projectName);

  if (!fs.existsSync(templatePath)) {
    logger.error(`Template introuvable : ${templatePath}`);
    process.exit(1);
  }

  // Handle existing directory
  if (fs.existsSync(targetPath)) {
    const { overwrite } = await inquirer.prompt([
      {
        type: "confirm",
        name: "overwrite",
        message: `Le dossier ${projectName} existe déjà. Voulez-vous l'écraser ?`,
        default: false,
      },
    ]);

    if (!overwrite) {
      logger.error("Opération annulée.");
      if (cleanup) await cleanup();
      process.exit(0);
    }
    fs.rmSync(targetPath, { recursive: true, force: true });
  }

  // Check dependencies based on template
  if (projectType === "php" && !isCommandAvailable("composer")) {
    logger.error("Composer n'est pas installé. Veuillez l'installer pour utiliser ce template.");
    process.exit(1);
  }
  if (projectType === "python" && !isCommandAvailable("python3") && !isCommandAvailable("python")) {
    logger.error("Python n'est pas installé. Veuillez l'installer pour utiliser ce template.");
    process.exit(1);
  }

  try {
    const userConfig = config.readConfig();

    // Collect more info for variables
    const details = await inquirer.prompt([
      {
        type: "input",
        name: "description",
        message: "Description du projet :",
        default: "",
      },
      {
        type: "input",
        name: "author",
        message: "Auteur :",
        default: userConfig.author || "",
      },
    ]);

    // Save preferences
    if (details.author !== userConfig.author) {
      config.writeConfig({ ...userConfig, author: details.author });
    }

    const variables = {
      project_name: projectName,
      author: details.author,
      description: details.description,
      version: "1.0.0",
    };

    copyDir(templatePath, targetPath, variables);

    // Post-copy actions
    const { initGit } = await inquirer.prompt([
      {
        type: "confirm",
        name: "initGit",
        message: "Voulez-vous initialiser un dépôt Git ?",
        default: true,
      },
    ]);

    if (initGit) {
      if (isCommandAvailable("git")) {
        execFileSync("git", ["init"], { cwd: targetPath, stdio: "ignore" });
        logger.success("Dépôt Git initialisé.");
      } else {
        logger.error("Git n'est pas installé, impossible d'initialiser le dépôt.");
      }
    }

    logger.success(`Projet ${projectName} créé avec succès !`);
  } catch (err) {
    logger.error(`Erreur lors de la création du projet : ${err.message}`);
    process.exit(1);
  } finally {
    if (cleanup) await cleanup();
  }
}
