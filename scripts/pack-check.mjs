import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
const manifest = JSON.parse(readFileSync('package.json', 'utf8'));
const [pack] = JSON.parse(
  execFileSync('npm', ['pack', '--dry-run', '--json', '--ignore-scripts'], {
    encoding: 'utf8',
  }),
);
const files = pack.files.map((f) => f.path);
assert.equal(manifest.name, '@smbc/ui');
assert.equal(manifest.version, '0.1.0');
assert.equal(manifest.publishConfig.access, 'restricted');
assert.equal(manifest.publishConfig.registry, undefined);
assert.equal(manifest.dependencies, undefined);
assert.deepEqual(manifest.sideEffects, ['**/*.css']);
for (const file of files)
  assert(
    /^(package\.json|README\.md|dist\/(?:[\w-]+\/)*[\w-]+\.(?:js|d\.ts|css))$/.test(
      file,
    ),
    `Unexpected file: ${file}`,
  );
for (const entry of Object.values(manifest.exports))
  for (const target of typeof entry === 'string'
    ? [entry]
    : Object.values(entry))
    assert(files.includes(target.slice(2)), `Missing ${target}`);
const css = readFileSync('dist/styles.css', 'utf8');
assert(
  !/@font-face|@import|url\(|#[\da-f]{3,8}\b|--[\w-]+\s*:/.test(css),
  'UI CSS must consume the theme, not redefine it',
);
assert(
  !/(?:^|\n)(?:html|body|h[1-6])\b/.test(css),
  'No global document styles',
);
for (const file of files.filter((f) => f.endsWith('.js')))
  assert(
    readFileSync(file, 'utf8').length < 20000,
    'Unexpected bundled runtime',
  );
console.log(
  `Verified ${files.length} runtime/documentation files, ${pack.size} compressed bytes.\n${files.join('\n')}`,
);
