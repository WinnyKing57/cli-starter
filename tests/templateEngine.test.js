const fs = require('fs');
const path = require('path');
const templateEngine = require('../src/core/templateEngine');

describe('templateEngine', () => {
  const testSrc = path.join(__dirname, 'test-src');
  const testDest = path.join(__dirname, 'test-dest');

  beforeEach(() => {
    if (!fs.existsSync(testSrc)) fs.mkdirSync(testSrc);
    if (fs.existsSync(testDest)) fs.rmSync(testDest, { recursive: true });
  });

  afterAll(() => {
    if (fs.existsSync(testSrc)) fs.rmSync(testSrc, { recursive: true });
    if (fs.existsSync(testDest)) fs.rmSync(testDest, { recursive: true });
  });

  test('should copy files and replace variables', () => {
    fs.writeFileSync(path.join(testSrc, 'hello.txt'), 'Hello {{project_name}}! By {{author}}.');

    const variables = {
      project_name: 'SuperProject',
      author: 'Jules'
    };

    templateEngine.copyDir(testSrc, testDest, variables);

    const content = fs.readFileSync(path.join(testDest, 'hello.txt'), 'utf8');
    expect(content).toBe('Hello SuperProject! By Jules.');
  });

  test('should handle binary files without corruption', () => {
    // Create a small binary-like buffer with a null byte
    const buffer = Buffer.from([0x00, 0x01, 0x02, 0x03, 0x7b, 0x7b, 0x70, 0x72, 0x6f, 0x6a, 0x65, 0x63, 0x74, 0x5f, 0x6e, 0x61, 0x6d, 0x65, 0x7d, 0x7d]);
    fs.writeFileSync(path.join(testSrc, 'binary.bin'), buffer);

    templateEngine.copyDir(testSrc, testDest, { project_name: 'test' });

    const copiedBuffer = fs.readFileSync(path.join(testDest, 'binary.bin'));
    expect(copiedBuffer).toEqual(buffer);
  });
});
