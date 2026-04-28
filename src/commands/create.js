const fs = require("fs");
const path = require("path");
const templateEngine = require("../core/templateEngine");
const logger = require("../utils/logger");

module.exports = (type, name) => {
  const templatePath = path.join(__dirname, "../../templates", type);
  const targetPath = path.join(process.cwd(), name);

  if (!fs.existsSync(templatePath)) {
    logger.error(`Template introuvable : ${type}`);
    process.exit(1);
  }

  if (fs.existsSync(targetPath)) {
    logger.error(`Le dossier existe déjà : ${name}`);
    process.exit(1);
  }

  try {
    templateEngine.copyDir(templatePath, targetPath, name);
    logger.success(`Projet ${name} créé avec le template ${type}`);
  } catch (err) {
    logger.error(`Erreur lors de la création du projet : ${err.message}`);
    process.exit(1);
  }
};
