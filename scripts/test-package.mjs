import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import {
  mkdtempSync,
  readFileSync,
  writeFileSync,
  copyFileSync,
  rmSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { createServer } from 'vite';
import { chromium } from 'playwright';
const run = (args, cwd) =>
  execFileSync('npm', args, {
    cwd,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  });
const root = process.cwd();
const temp = mkdtempSync(join(tmpdir(), 'smbc-ui-consumer-'));
let server, browser;
try {
  const [pack] = JSON.parse(
    run(
      ['pack', '--json', '--ignore-scripts', '--pack-destination', temp],
      root,
    ),
  );
  const dev = JSON.parse(readFileSync('package.json', 'utf8')).devDependencies;
  const dependencies = Object.fromEntries(
    [
      'react',
      'react-dom',
      'devextreme',
      'devextreme-react',
      '@types/react',
      '@types/react-dom',
      'typescript',
      'vite',
    ].map((key) => [
      key,
      JSON.parse(
        readFileSync(join(root, 'node_modules', key, 'package.json'), 'utf8'),
      ).version,
    ]),
  );
  dependencies['@smbc/ui'] = `file:${join(temp, pack.filename)}`;
  dependencies['@smbc/devextreme-theme'] =
    `file:${resolve(root, dev['@smbc/devextreme-theme'].slice(5))}`;
  writeFileSync(
    join(temp, 'package.json'),
    JSON.stringify({ type: 'module', private: true, dependencies }),
  );
  run(['install', '--no-audit', '--no-fund'], temp);
  copyFileSync('tests/consumer.tsx', join(temp, 'main.tsx'));
  writeFileSync(
    join(temp, 'index.html'),
    '<!DOCTYPE html><html><body class="dx-viewport"><div id="root"></div><script type="module" src="/main.tsx"></script></body></html>',
  );
  writeFileSync(
    join(temp, 'tsconfig.json'),
    JSON.stringify({
      compilerOptions: {
        target: 'ES2022',
        module: 'ESNext',
        moduleResolution: 'Bundler',
        jsx: 'react-jsx',
        strict: true,
        skipLibCheck: true,
        noEmit: true,
        types: ['vite/client'],
      },
      include: ['*.tsx'],
    }),
  );
  execFileSync('node', [join(temp, 'node_modules/typescript/bin/tsc')], {
    cwd: temp,
    stdio: 'inherit',
  });
  execFileSync('node', [join(temp, 'node_modules/vite/bin/vite.js'), 'build'], {
    cwd: temp,
    stdio: 'inherit',
  });
  server = await createServer({
    root: temp,
    configFile: false,
    server: { host: '127.0.0.1', port: 0 },
  });
  await server.listen();
  browser = await chromium.launch();
  const page = await browser.newPage();
  page.setDefaultTimeout(10000);
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto(server.resolvedUrls.local[0]);
  await page.getByRole('button', { name: 'Count', exact: true }).click();
  assert.equal(await page.locator('#count').textContent(), '1');
  await page.getByLabel('Reference', { exact: true }).fill('Changed');
  await page.getByLabel('Reference', { exact: true }).press('Tab');
  assert.equal(await page.locator('#value').textContent(), 'Changed');
  assert.equal(
    await page.getByLabel('Default', { exact: true }).inputValue(),
    'Uncontrolled',
  );
  await page.getByLabel('Default', { exact: true }).fill('Edited');
  await page.getByRole('button', { name: 'Count', exact: true }).click();
  assert.equal(
    await page.getByLabel('Default', { exact: true }).inputValue(),
    'Edited',
  );
  assert(
    (await page
      .getByLabel('Read only', { exact: true })
      .getAttribute('readonly')) !== null,
  );
  assert(
    (await page
      .getByRole('button', { name: 'Disabled', exact: true })
      .getAttribute('aria-disabled')) === 'true',
  );
  const invalid = page.getByRole('textbox', { name: 'Invalid', exact: true });
  assert.equal(await invalid.getAttribute('aria-required'), 'true');
  assert.equal(await invalid.getAttribute('aria-invalid'), 'true');
  const described = await invalid.getAttribute('aria-describedby');
  assert(described);
  const descriptions = await page.evaluate(
    (ids) =>
      ids.split(' ').map((id) => document.getElementById(id)?.textContent),
    described,
  );
  assert(descriptions.includes('Server error'));
  assert(descriptions.includes('Always available help'));
  await page.getByRole('button', { name: 'Clear error', exact: true }).click();
  await page.locator('.smbc-ui-field__error').waitFor({ state: 'detached' });
  const remainingDescriptions = await invalid.evaluate((element) =>
    (element.getAttribute('aria-describedby') ?? '')
      .split(' ')
      .filter(Boolean)
      .map((id) => document.getElementById(id)?.textContent),
  );
  assert.deepEqual(remainingDescriptions, ['Always available help']);
  assert.notEqual(await invalid.getAttribute('aria-invalid'), 'true');

  await page.getByLabel('Amount', { exact: true }).fill('');
  await page.getByLabel('Amount', { exact: true }).press('Tab');
  assert.equal(await page.locator('#amount').textContent(), 'null');
  await page.getByLabel('Choice', { exact: true }).click();
  await page.getByRole('option', { name: 'Two', exact: true }).click();
  assert.equal(await page.locator('#choice').textContent(), 'Two');
  await page
    .getByRole('option', { name: 'Two', exact: true })
    .waitFor({ state: 'hidden' });
  await page.getByRole('checkbox', { name: 'Accept', exact: true }).click();
  assert.equal(await page.locator('#checked').textContent(), 'true');
  assert.equal(
    await page.getByLabel('Date', { exact: true }).inputValue(),
    '2026-01-01',
  );
  await page.getByRole('radio', { name: 'High', exact: true }).click();
  assert.equal(
    await page
      .getByRole('radio', { name: 'High', exact: true })
      .getAttribute('aria-checked'),
    'true',
  );
  await page.getByLabel('Teams', { exact: true }).click();
  await page.getByRole('option', { name: 'Two', exact: true }).click();
  assert.equal(await page.locator('#teams').textContent(), 'One');
  await page.getByRole('button', { name: 'Cancel', exact: true }).click();
  await page
    .getByRole('option', { name: 'Two', exact: true })
    .waitFor({ state: 'hidden' });
  assert.equal(await page.locator('#teams').textContent(), 'One');
  await page.getByLabel('Teams', { exact: true }).click();
  await page.getByRole('option', { name: 'Two', exact: true }).click();
  await page.getByRole('button', { name: 'OK', exact: true }).click();
  assert.equal(await page.locator('#teams').textContent(), 'One,Two');
  assert.equal(await page.locator('#tab').textContent(), '0');
  assert.equal(await page.locator('#accordion').textContent(), '0');
  await page.getByRole('tab', { name: /Second/ }).click();
  assert.equal(await page.locator('#tab').textContent(), '1');
  await page.getByRole('tablist', { name: 'Example tabs' }).focus();
  await page.keyboard.press('Home');
  await page.keyboard.press('ArrowRight');
  assert(
    await page
      .getByRole('tab', { name: /Second/ })
      .evaluate((e) => e.classList.contains('dx-state-focused')),
  );
  await page.getByText('Beta', { exact: true }).click();
  assert.equal(await page.locator('#accordion').textContent(), '1');
  await page.getByText('Beta', { exact: true }).click();
  assert.equal(await page.locator('#accordion').textContent(), '-1');
  await page.getByRole('button', { name: 'Open', exact: true }).click();
  await page.getByRole('dialog').waitFor();
  await page.waitForFunction(() =>
    [...document.querySelectorAll('[role="dialog"]')].some(
      (element) =>
        element.getClientRects().length &&
        element.contains(document.activeElement),
    ),
  );
  await page.getByRole('button', { name: 'Close content' }).click();
  await page.getByRole('dialog').waitFor({ state: 'hidden' });
  await page.getByRole('button', { name: 'Open', exact: true }).click();
  await page.getByRole('dialog').waitFor();
  await page.waitForFunction(() =>
    [...document.querySelectorAll('[role="dialog"]')].some(
      (element) =>
        element.getClientRects().length &&
        element.contains(document.activeElement),
    ),
  );
  await page.keyboard.press('Escape');
  await page.getByRole('dialog').waitFor({ state: 'hidden' });
  await page.getByRole('button', { name: 'Confirm action' }).click();
  await page.getByRole('button', { name: 'Delete', exact: true }).click();
  await page.getByText('Deleted', { exact: true }).waitFor();
  await page.waitForFunction(
    () => document.querySelector('#toast').textContent === 'false',
  );
  await page.getByRole('button', { name: 'Validate', exact: true }).click();
  await page
    .locator('.dx-validationsummary')
    .getByText('Email required', { exact: true })
    .waitFor();
  await page
    .locator('.dx-validationsummary')
    .getByText('Minimum ten', { exact: true })
    .waitFor();
  assert.equal(
    await page
      .locator('.dx-data-row')
      .getByText('Cell', { exact: true })
      .count(),
    2,
  );
  await page.locator('.dx-data-row').first().getByRole('checkbox').click();
  assert.equal(await page.locator('#keys').textContent(), '1');
  await page.locator('.dx-page').filter({ hasText: /^2$/ }).click();
  await page.locator('.dx-data-row').getByText('C', { exact: true }).waitFor();
  await page.locator('.dx-datagrid-filter-row input').first().fill('B');
  await page.locator('.dx-datagrid-filter-row input').first().press('Tab');
  await page.locator('.dx-data-row').getByText('B', { exact: true }).waitFor();
  assert.equal(await page.locator('.dx-data-row').count(), 1);
  assert(
    await page.locator('.dx-data-row').getByText('B', { exact: true }).count(),
  );
  await page.locator('.dx-header-filter').first().click();
  await page.getByRole('button', { name: 'OK', exact: true }).waitFor();
  await page.getByRole('button', { name: 'Cancel', exact: true }).click();
  await page
    .getByRole('option', { name: 'Two', exact: true })
    .waitFor({ state: 'hidden' });
  assert.deepEqual(errors, []);
  console.log(
    'PASS: packed consumer types, production build, controls, accessibility, validation, overlays, tabs, accordion, grid selection/filter/header filter/paging/custom cells.',
  );
} finally {
  await browser?.close();
  await server?.close();
  rmSync(temp, { recursive: true, force: true });
}
