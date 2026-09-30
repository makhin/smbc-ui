import assert from 'node:assert/strict';
import { runNpm } from './run-npm.mjs';
import { readFileSync } from 'node:fs';
const manifest = JSON.parse(readFileSync('package.json', 'utf8'));
const [pack] = JSON.parse(
  runNpm(['pack', '--dry-run', '--json', '--ignore-scripts'], {
    encoding: 'utf8',
  }),
);
const files = pack.files.map((f) => f.path);
assert.equal(manifest.name, '@smbc/ui');
assert.equal(pack.version, manifest.version);
assert.equal(manifest.publishConfig.access, 'restricted');
assert.equal(manifest.publishConfig.registry, undefined);
assert.equal(manifest.dependencies, undefined);
assert.deepEqual(manifest.sideEffects, ['**/*.css']);
for (const file of files)
  assert(
    /^(package\.json|README\.md|dist\/(?:[\w-]+\/)*[\w-]+\.(?:js|d\.ts|css|css\.d\.ts))$/.test(
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
  !/@font-face|@import|url\(|@theme|@source|@reference|@tailwind/.test(css),
  'Published CSS must be compiled and asset/theme-import free',
);
assert(
  !/(?:^|\n)(?:html|body|h[1-6])\b/.test(css),
  'No global document styles',
);
// Tailwind's --tw-* property bookkeeping is expected; canonical tokens are not.
for (const [, name] of css.matchAll(/(--[\w-]+)\s*:/g)) {
  assert(name.startsWith('--tw-'), `UI must not redefine design token ${name}`);
}
assert(!/box-sizing:border-box;margin:0|button,input,optgroup,select,textarea/.test(css), 'No Preflight');
assert(css.includes('.ui\\:flex{') && css.includes('.ui\\:text-danger{'), 'Component utilities must be in the archive');
assert(!/\.(?:bg|text)-(?:green|emerald|red)-/.test(css), 'No palette utilities');
for (const file of files.filter((f) => f.endsWith('.js')))
  assert(
    readFileSync(file, 'utf8').length < 20000,
    'Unexpected bundled runtime',
  );
console.log(
  `Verified ${files.length} runtime/documentation files, ${pack.size} compressed bytes.\n${files.join('\n')}`,
);
