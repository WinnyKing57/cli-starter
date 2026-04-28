const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
const inquirer = require("inquirer");
const templateEngine = require("../core/templateEngine");
const logger = require("../utils/logger");

module.exports = async (type, name) => {
  let projectType = type;
  let projectName = name;

  const templatesPath = path.join(__dirname, "../../templates");
  const availableTemplates = fs.readdirSync(templatesPath).filter(file => {
    return fs.statSync(path.join(templatesPath, file)).isDirectory();
  });

  if (!projectType || !projectName) {
    const questions = [];

    if (!projectType) {
      questions.push({
        type: "list",
        name: "type",
        message: "Quel type de projet souhaitez-vous créer ?",
        choices: availableTemplates,
      });
    }

    if (!projectName) {
      questions.push({
        type: "input",
        name: "name",
        message: "Quel est le nom de votre projet ?",
        validate: (input) => (input.trim() !== "" ? true : "Le nom ne peut pas être vide."),
      });
    }

    const answers = await inquirer.prompt(questions);
    projectType = projectType || answers.type;
    projectName = projectName || answers.name;
  }

  const templatePath = path.join(templatesPath, projectType);
  const targetPath = path.join(process.cwd(), projectName);

  if (!fs.existsSync(templatePath)) {
    logger.error(`Template introuvable : ${projectType}`);
    process.exit(1);
  }

  if (fs.existsSync(targetPath)) {
    logger.error(`Le dossier existe déjà : ${projectName}`);
    process.exit(1);
  }

  try {
    const extraInfo = await inquirer.prompt([
      {
        type: "input",
        name: "description",
        message: "Description du projet :",
        default: `A new ${projectType} project created with cli-starter`,
      },
      {
        type: "input",
        name: "author",
        message: "Auteur :",
        default: "",
      },
      {
        type: "input",
        name: "version",
        message: "Version :",
        default: "1.0.0",
      },
      {
        type: "confirm",
        name: "runInit",
        message: "Voulez-vous initialiser git et installer les dépendances ?",
        default: true,
      }
    ]);

    const variables = {
      project_name: projectName,
      description: extraInfo.description,
      author: extraInfo.author,
      version: extraInfo.version,
    };

    templateEngine.copyDir(templatePath, targetPath, variables);

    // Automatic initialization
    if (extraInfo.runInit) {
      process.chdir(targetPath);

      try {
        logger.success("Initialisation de Git...");
        execSync("git init", { stdio: "ignore" });
      } catch (e) {
        logger.error("Impossible d'initialiser Git");
      }

      const hasPackageJson = fs.existsSync(path.join(targetPath, "package.json"));
      const hasComposerJson = fs.existsSync(path.join(targetPath, "composer.json"));
      const hasRequirementsTxt = fs.existsSync(path.join(targetPath, "requirements.txt"));

      if (hasPackageJson) {
        logger.success("Installation des dépendances npm...");
        try {
          execSync("npm install", { stdio: "inherit" });
        } catch (e) {
          logger.error("Échec de l'installation des dépendances npm");
        }
      } else if (hasComposerJson) {
        logger.success("Installation des dépendances composer...");
        try {
          execSync("composer install", { stdio: "inherit" });
        } catch (e) {
          logger.error("Échec de l'installation des dépendances composer");
        }
      } else if (hasRequirementsTxt) {
        logger.success("Création de l'environnement virtuel Python...");
        try {
          execSync("python3 -m venv venv", { stdio: "ignore" });
          logger.success("Environnement virtuel créé (utilisez 'source venv/bin/activate' pour l'activer)");
        } catch (e) {
          logger.error("Échec de la création de l'environnement virtuel Python");
        }
      }
    }

    logger.success(`Projet ${projectName} créé avec succès !`);
  } catch (err) {
    logger.error(`Erreur lors de la création du projet : ${err.message}`);
    process.exit(1);
  }
};
