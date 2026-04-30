import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { jest } from "@jest/globals";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

jest.unstable_mockModule("../src/core/templateEngine.js", () => ({
  copyDir: jest.fn(),
}));

jest.unstable_mockModule("inquirer", () => ({
  default: {
    prompt: jest.fn(),
  },
}));

jest.unstable_mockModule("../src/utils/logger.js", () => ({
  default: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

jest.unstable_mockModule("child_process", () => ({
  execSync: jest.fn(),
  execFileSync: jest.fn(),
}));

const create = (await import("../src/commands/create.js")).default;
const templateEngine = await import("../src/core/templateEngine.js");
const inquirer = (await import("inquirer")).default;
const logger = (await import("../src/utils/logger.js")).default;

describe("create command", () => {
  const templatesPath = path.join(__dirname, "../templates");
  const targetPath = path.join(process.cwd(), "test-project");

  beforeEach(() => {
    jest.clearAllMocks();
    if (fs.existsSync(targetPath)) {
      fs.rmSync(targetPath, { recursive: true, force: true });
    }
    // Mock process.exit
    jest.spyOn(process, "exit").mockImplementation((code) => {
      throw new Error(`Process exited with code: ${code}`);
    });
  });

  afterEach(() => {
    process.exit.mockRestore();
  });

  test("should create a project with given arguments", async () => {
    inquirer.prompt.mockResolvedValueOnce({ description: "desc", author: "jules" });
    inquirer.prompt.mockResolvedValueOnce({ initGit: false });

    await create("html", "test-project");

    expect(templateEngine.copyDir).toHaveBeenCalledWith(
      path.join(templatesPath, "html"),
      targetPath,
      expect.objectContaining({
        project_name: "test-project",
        author: "jules",
        description: "desc",
      })
    );
    expect(logger.success).toHaveBeenCalledWith(expect.stringContaining("test-project"));
  });

  test("should fail if template does not exist", async () => {
    await expect(create("non-existent", "test-project")).rejects.toThrow(
      "Process exited with code: 1"
    );
    expect(logger.error).toHaveBeenCalledWith(expect.stringContaining("Template introuvable"));
  });

  test("should ask to overwrite if destination exists", async () => {
    fs.mkdirSync(targetPath);
    inquirer.prompt.mockResolvedValueOnce({ overwrite: true });
    inquirer.prompt.mockResolvedValueOnce({ description: "desc", author: "jules" });
    inquirer.prompt.mockResolvedValueOnce({ initGit: false });

    await create("html", "test-project");

    expect(templateEngine.copyDir).toHaveBeenCalled();
  });

  test("should cancel if destination exists and user refuses overwrite", async () => {
    fs.mkdirSync(targetPath);
    inquirer.prompt.mockResolvedValueOnce({ overwrite: false });

    await expect(create("html", "test-project")).rejects.toThrow("Process exited with code: 0");
    expect(logger.error).toHaveBeenCalledWith("Opération annulée.");
  });
});
