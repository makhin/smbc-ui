import { rmSync, copyFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
rmSync('dist', { recursive: true, force: true });
execFileSync('node', ['node_modules/typescript/bin/tsc'], { stdio: 'inherit' });
copyFileSync('src/styles/styles.css', 'dist/styles.css');
copyFileSync('src/styles/styles.css.d.ts', 'dist/styles.css.d.ts');
