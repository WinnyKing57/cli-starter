# cli-starter

A simple CLI tool to generate project boilerplates (HTML, PHP, Node.js).

It allows you to quickly scaffold ready-to-use project structures from templates.

---

## 🚀 Features

- Generate HTML projects
- Generate PHP projects
- Generate Node.js projects
- Simple CLI usage
- Extensible template system

---

## 📦 Installation

### Global install (recommended)

```bash
npm install -g cli-starter
```

### Or from source

```bash
git clone https://github.com/WinnyKing57/cli-starter.git
cd cli-starter
npm install
npm link
```

---

## ⚙️ Usage

```bash
cli-starter create html my-project
cli-starter create php my-project
cli-starter create node my-project
```

---

## 📁 Structure

```
cli-starter/
├── bin/
├── src/
├── templates/
```

---

## 🧠 How it works

Copies templates from `/templates` and generates a project based on the selected type.

---

## 🛠️ Development

```bash
node bin/cli.js create html test
```

---

## 📌 Requirements

- Node.js >= 16
- npm

---

## 📄 License

MIT
