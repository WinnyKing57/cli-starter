# cli-starter

A robust and extensible CLI tool to instantly scaffold project boilerplates. Stop wasting time with manual setup and start coding in seconds.

---

## 🚀 Features

- **Multiple Templates**: Support for HTML, PHP, Node.js, Express, React (Vite), Tailwind CSS, and Python.
- **Interactive Mode**: Easy-to-use prompts to configure your project.
- **Automatic Initialization**: Optional `git init` and dependency installation (`npm install`, `composer install`, `venv`).
- **Dynamic Variable Replacement**: Automatically injects project name, author, description, and version into your files.
- **Safe Copying**: Heuristic detection of binary files to prevent corruption.
- **Extensible**: Easily add your own templates.

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

### Interactive Mode (Recommended)

Simply run the command and follow the prompts:

```bash
cli-starter create
```

### Command Line Arguments

You can also specify the template type and project name directly:

```bash
cli-starter create <type> <name>
```

**Available Types:**
- `html`: Simple static website (HTML/CSS/JS)
- `php`: PHP project with `public/` directory and `composer.json`
- `node`: Basic Node.js setup
- `express`: Express.js API with cors and dotenv
- `react`: React project using Vite
- `tailwind`: HTML project with Tailwind CSS via CDN
- `python`: Python script with `requirements.txt` and venv setup

---

## 📁 Project Structure

```
cli-starter/
├── bin/           # CLI entry point
├── src/
│   ├── commands/  # CLI command logic
│   ├── core/      # Template engine
│   └── utils/     # Helpers and logger
├── templates/     # Project templates
└── tests/         # Unit tests
```

---

## 🧠 How it works

The CLI clones the selected template directory to your specified path. During the process, it identifies text files and replaces placeholders like `{{project_name}}`, `{{author}}`, `{{description}}`, and `{{version}}` with the information you provide. Binary files (images, etc.) are detected and copied without modification to ensure they are not corrupted.

---

## 🛠️ Development & Testing

To run the CLI from source during development:
```bash
node bin/cli.js create
```

To run the test suite:
```bash
npm test
```

---

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for details on how to add new templates or improve the tool.

---

## 📌 Requirements

- Node.js >= 16
- npm
- (Optional) Git, Composer, Python3

---

## 📄 License

MIT
