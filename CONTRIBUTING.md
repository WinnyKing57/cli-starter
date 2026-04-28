# Contributing to cli-starter

Thank you for your interest in contributing to cli-starter! We welcome all contributions to make this tool even better.

## How to add a new template

Adding a new template is very easy. Just follow these steps:

1.  **Create a new directory** in the `templates/` folder with the name of your template (e.g., `templates/my-new-template/`).
2.  **Add the project files** to this directory.
3.  **Use placeholders** for dynamic values. The template engine currently supports:
    -   `{{project_name}}`: The name of the project provided by the user.
    -   `{{description}}`: A short description of the project.
    -   `{{author}}`: The author's name.
    -   `{{version}}`: The project version.
4.  **Add a `README.md`** inside your template directory to explain what it contains.
5.  **Test your template** locally by running:
    ```bash
    node bin/cli.js create my-new-template test-project
    ```

## Code Guidelines

-   Keep the code simple and modular.
-   Use the `logger` utility for all console output.
-   Run existing tests before submitting a pull request: `npm test`.
-   Add new tests if you introduce new core functionality.

## Reporting Issues

If you find a bug or have a feature request, please open an issue on GitHub.
