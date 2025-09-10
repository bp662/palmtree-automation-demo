// run-all-tests.js (ESM; your package.json is already "type": "module")
import { readdir } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TEST_DIR = path.join(__dirname, 'mobile-automation');

// Optional: pass a glob-ish filter via CLI (e.g., node run-all-tests.js login)
// This will include files whose names contain that string.
const filter = (process.argv[2] || '').toLowerCase();

// Optional: exclude certain files by name (substring match)
const EXCLUDES = ['example', '.spec.backup'];

function runCmd(cmd, cwd) {
  return new Promise((resolve, reject) => {
    exec(cmd, { cwd }, (error, stdout, stderr) => {
      if (error) {
        console.error(stderr || error.message);
        reject(error);
        return;
      }
      if (stdout) console.log(stdout.trim());
      resolve();
    });
  });
}

(async () => {
  // 1) Get all .js files in TEST_DIR
  let files = (await readdir(TEST_DIR))
    .filter(f => f.endsWith('.js'))
    .filter(f => (filter ? f.toLowerCase().includes(filter) : true))
    .filter(f => !EXCLUDES.some(ex => f.includes(ex)))
    .sort(); // control order by filename; use 01_, 02_ prefixes if needed

  if (files.length === 0) {
    console.log('No test files found in mobile-automation/ matching your criteria.');
    process.exit(0);
  }

  console.log(`Found ${files.length} test file(s):\n- ${files.join('\n- ')}\n`);

  // 2) Run each test sequentially
  for (const f of files) {
    console.log(`\n🚀 Running: ${f}`);
    try {
      await runCmd(`node ${f}`, TEST_DIR);
      console.log(`✅ Passed: ${f}`);
    } catch (e) {
      console.error(`❌ Failed: ${f}\nStopping suite.`);
      process.exit(1);
    }
  }

  console.log('\n🎉 All mobile tests completed successfully.');
})();