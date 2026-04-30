import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { copyDir } from "../src/core/templateEngine.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

describe("templateEngine", () => {
  const testSrc = path.join(__dirname, "test-src");
  const testDest = path.join(__dirname, "test-dest");

  beforeEach(() => {
    if (!fs.existsSync(testSrc)) fs.mkdirSync(testSrc);
    if (fs.existsSync(testDest)) fs.rmSync(testDest, { recursive: true, force: true });
  });

  afterAll(() => {
    if (fs.existsSync(testSrc)) fs.rmSync(testSrc, { recursive: true, force: true });
    if (fs.existsSync(testDest)) fs.rmSync(testDest, { recursive: true, force: true });
  });

  test("should copy files and replace variables", () => {
    fs.writeFileSync(path.join(testSrc, "hello.txt"), "Hello {{project_name}}! By {{author}}.");

    const variables = {
      project_name: "SuperProject",
      author: "Jules",
    };

    copyDir(testSrc, testDest, variables);

    const content = fs.readFileSync(path.join(testDest, "hello.txt"), "utf8");
    expect(content).toBe("Hello SuperProject! By Jules.");
  });

  test("should handle binary files without corruption", () => {
    // Create a small binary-like buffer with a null byte
    const buffer = Buffer.from([
      0x00, 0x01, 0x02, 0x03, 0x7b, 0x7b, 0x70, 0x72, 0x6f, 0x6a, 0x65, 0x63, 0x74, 0x5f, 0x6e,
      0x61, 0x6d, 0x65, 0x7d, 0x7d,
    ]);
    fs.writeFileSync(path.join(testSrc, "binary.bin"), buffer);

    copyDir(testSrc, testDest, { project_name: "test" });

    const copiedBuffer = fs.readFileSync(path.join(testDest, "binary.bin"));
    expect(copiedBuffer).toEqual(buffer);
  });

  test("should copy directories recursively", () => {
    const subDir = path.join(testSrc, "subdir");
    fs.mkdirSync(subDir);
    fs.writeFileSync(path.join(subDir, "file.txt"), "content in {{project_name}}");

    copyDir(testSrc, testDest, { project_name: "RecursiveTest" });

    const copiedFilePath = path.join(testDest, "subdir", "file.txt");
    expect(fs.existsSync(copiedFilePath)).toBe(true);
    const content = fs.readFileSync(copiedFilePath, "utf8");
    expect(content).toBe("content in RecursiveTest");
  });
});
