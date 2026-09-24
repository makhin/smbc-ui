import { rmSync, copyFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const tsc = require.resolve('typescript/bin/tsc');
rmSync('dist', { recursive: true, force: true });
execFileSync(process.execPath, [tsc], { stdio: 'inherit' });
copyFileSync('src/styles/styles.css', 'dist/styles.css');
copyFileSync('src/styles/styles.css.d.ts', 'dist/styles.css.d.ts');
