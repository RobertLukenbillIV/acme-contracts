import { spawnSync } from 'child_process';
import test from 'node:test';
import assert from 'node:assert';

test('validate-tsrefs passes on repository', () => {
  const res = spawnSync(process.execPath, ['scripts/validate-tsrefs.js'], { encoding: 'utf8' });
  // Show output in CI logs for debugging if needed
  console.log(res.stdout);
  console.error(res.stderr);

  assert.strictEqual(res.status, 0, `validate script exited with ${res.status}\n${res.stderr}`);
  assert.match(res.stdout, /tsconfig references validation passed/i);
});
