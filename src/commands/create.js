const fs = require("fs");
const path = require("path");

function copyDir(src, dest, projectName) {
  fs.mkdirSync(dest, { recursive: true });

  const entries = fs.readdirSync(src);

  for (const entry of entries) {
    const srcPath = path.join(src, entry);
    const destPath = path.join(dest, entry);

    const stat = fs.statSync(srcPath);

    if (stat.isDirectory()) {
      copyDir(srcPath, destPath, projectName);
    } else {
      let content = fs.readFileSync(srcPath, "utf8");

      content = content.replace(/{{project_name}}/g, projectName);

      fs.writeFileSync(destPath, content);
    }
  }
}

module.exports = (type, name) => {
  const templatePath = path.join(__dirname, "../../templates", type);
  const targetPath = path.join(process.cwd(), name);

  if (!fs.existsSync(templatePath)) {
    console.error("❌ Template introuvable :", type);
    process.exit(1);
  }

  if (fs.existsSync(targetPath)) {
    console.error("❌ Le dossier existe déjà :", name);
    process.exit(1);
  }

  copyDir(templatePath, targetPath, name);

  console.log(`✅ Projet ${name} créé avec le template ${type}`);
};
