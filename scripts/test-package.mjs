import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { runNpm } from './run-npm.mjs';
import {
  existsSync,
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
const require = createRequire(import.meta.url);
const run = (args, cwd) =>
  runNpm(args, {
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
        readFileSync(require.resolve(`${key}/package.json`), 'utf8'),
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
  assert(!existsSync(join(temp, 'node_modules/tailwindcss')), 'Consumer must run without Tailwind');
  assert(!existsSync(join(temp, 'node_modules/@tailwindcss')), 'Consumer must run without Tailwind plugins');
  writeFileSync(join(temp, 'css-import.ts'), "import '@smbc/ui/styles.css';\n");
  writeFileSync(
    join(temp, 'tsconfig-css.json'),
    JSON.stringify({
      compilerOptions: {
        module: 'ESNext',
        moduleResolution: 'Bundler',
        noEmit: true,
        noUncheckedSideEffectImports: true,
        types: [],
      },
      files: ['css-import.ts'],
    }),
  );
  execFileSync(
    'node',
    [join(temp, 'node_modules/typescript/bin/tsc'), '-p', 'tsconfig-css.json'],
    { cwd: temp, stdio: 'inherit' },
  );
  copyFileSync('tests/consumer.tsx', join(temp, 'main.tsx'));
  copyFileSync('tests/types.tsx', join(temp, 'types.tsx'));
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
  const waitForDialogFocus = async (name) => {
    const dialog = page.getByRole('dialog', { name, exact: true });
    await dialog.waitFor();
    await page.waitForFunction((el) => el.contains(document.activeElement), await dialog.elementHandle());
  };
  assert(!dependencies.tailwindcss && !dependencies['@tailwindcss/vite']);
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto(server.resolvedUrls.local[0]);
  const visuals = await page.evaluate(() => {
    const styles = (selector) => {
      const el = document.querySelector(selector);
      const s = getComputedStyle(el);
      return { display: s.display, padding: s.padding, radius: s.borderRadius,
        background: s.backgroundColor, color: s.color, borderStyle: s.borderTopStyle };
    };
    return { card: styles('.smbc-ui-card'), body: styles('#isolation-card-body'),
      badge: styles('#isolation-badge'), callout: styles('#isolation-callout'),
      field: styles('.smbc-ui-field'), filter: styles('#isolation-filter-panel') };
  });
  assert.equal(visuals.card.radius, '6px');
  assert.equal(visuals.card.background, 'rgb(255, 255, 255)');
  assert.equal(visuals.card.borderStyle, 'solid');
  // Compiled package styles must still follow runtime theme overrides.
  for (const width of ['3px', '1px']) {
    await page.evaluate((value) => document.documentElement.style.setProperty('--border-width-default', value), width);
    assert.equal(await page.locator('.smbc-ui-card').first().evaluate((el) => getComputedStyle(el).borderTopWidth), width);
  }
  await page.evaluate(() => document.documentElement.style.removeProperty('--border-width-default'));

  assert.equal(visuals.body.padding, '16px');
  assert.equal(visuals.badge.color, 'rgb(0, 122, 82)');
  assert.equal(visuals.badge.radius, '999px');
  assert.equal(visuals.callout.background, 'rgba(195, 39, 43, 0.07)');
  assert.equal(visuals.field.display, 'block');
  assert.equal(visuals.filter.padding, '16px');
  assert.equal(visuals.filter.background, 'rgb(255, 255, 255)');
  assert.equal(visuals.filter.display, 'block');
  assert.equal(await page.locator('.smbc-ui-empty-state-icon .dx-icon').evaluate((el) => getComputedStyle(el).fontSize), '20px');
  await page.getByRole('button', { name: 'Count', exact: true }).click();
  assert.equal(await page.locator('#count').textContent(), '1');
  const toolbar = page.locator('#consumer-toolbar.dx-toolbar');
  await toolbar.getByText('Actions', { exact: true }).waitFor();
  await toolbar.getByRole('button', { name: 'Toolbar count', exact: true }).click();
  assert.equal(await page.locator('#count').textContent(), '2');
  await toolbar.locator('.dx-dropdownmenu-button').click();
  await page.getByText('Toolbar menu action', { exact: true }).click();
  assert.equal(await page.locator('#count').textContent(), '3');
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
  const direct = page.getByRole('textbox', {
    name: 'Direct error input',
    exact: true,
  });
  const composite = page.getByRole('checkbox', {
    name: 'External checkbox',
    exact: true,
  });
  assert.equal(await direct.getAttribute('aria-invalid'), 'true');
  assert.equal(await direct.getAttribute('data-preserved'), 'input');
  assert.equal(await composite.getAttribute('data-preserved'), 'checkbox');
  assert.equal(await composite.getAttribute('aria-invalid'), 'true');
  assert.equal(await composite.getAttribute('aria-required'), 'true');
  assert(
    (await composite.getAttribute('aria-describedby')).includes(
      'composite-error-help',
    ),
  );
  assert(
    (await composite.getAttribute('aria-describedby')).includes(
      'composite-error-error',
    ),
  );
  assert.notEqual(
    await page
      .getByLabel('Explicit undefined', { exact: true })
      .getAttribute('aria-invalid'),
    'true',
  );
  await page.getByRole('button', { name: 'Clear error', exact: true }).click();
  await page.waitForFunction(
    () => !document.querySelector('[id$="-error"][role="alert"]'),
  );
  const remainingDescriptions = await invalid.evaluate((element) =>
    (element.getAttribute('aria-describedby') ?? '')
      .split(' ')
      .filter(Boolean)
      .map((id) => document.getElementById(id)?.textContent),
  );
  assert.deepEqual(remainingDescriptions, ['Always available help']);
  assert.notEqual(await invalid.getAttribute('aria-invalid'), 'true');
  assert.notEqual(await direct.getAttribute('aria-invalid'), 'true');
  assert.notEqual(await composite.getAttribute('aria-invalid'), 'true');
  assert.equal(
    await composite.getAttribute('aria-describedby'),
    'composite-error-help',
  );
  await page
    .getByRole('button', { name: 'Restore errors', exact: true })
    .click();
  await page.waitForFunction(
    () =>
      document
        .getElementById('composite-error')
        ?.getAttribute('aria-invalid') === 'true',
  );
  assert.equal(await direct.getAttribute('aria-invalid'), 'true');
  await page
    .getByRole('button', { name: 'Clear errors to undefined', exact: true })
    .click();
  await page.waitForFunction(
    () => !document.querySelector('[id$="-error"][role="alert"]'),
  );
  for (const control of [invalid, direct, composite])
    assert.notEqual(await control.getAttribute('aria-invalid'), 'true');
  assert.equal(
    await composite.getAttribute('aria-describedby'),
    'composite-error-help',
  );

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
  await waitForDialogFocus('Dialog title');
  await page.getByRole('button', { name: 'Close content' }).click();
  await page.getByRole('dialog').waitFor({ state: 'hidden' });
  await page.getByRole('button', { name: 'Open', exact: true }).click();
  await waitForDialogFocus('Dialog title');
  await page.keyboard.press('Escape');
  await page.getByRole('dialog').waitFor({ state: 'hidden' });
  // Click as soon as the action is available, including during opening.
  // Do not wait for focus/onShown: that would hide moving-target regressions.
  for (const reducedMotion of ['reduce', 'no-preference']) {
    await page.emulateMedia({ reducedMotion });
    for (let attempt = 0; attempt < 8; attempt++) {
      await page.getByRole('button', { name: 'Confirm action' }).click();
      const confirmation = page.getByRole('dialog', { name: 'Delete item?', exact: true });
      await confirmation.getByRole('button', { name: 'Cancel', exact: true }).click();
      await confirmation.waitFor({ state: 'hidden' });
      assert.equal(await page.locator('#toast').textContent(), 'false');
    }
  }
  await page.getByRole('button', { name: 'Confirm action' }).click();
  await waitForDialogFocus('Delete item?');
  await Promise.all([
    page.getByText('Deleted', { exact: true }).waitFor(),
    page.getByRole('button', { name: 'Delete', exact: true }).click(),
  ]);
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
  const email = page.locator('#vendor-email');
  assert.equal(await email.getAttribute('aria-invalid'), 'true');
  const vendorDescriptions = await email.evaluate((element) =>
    (element.getAttribute('aria-describedby') ?? '')
      .split(' ')
      .filter(Boolean)
      .map((id) => document.getElementById(id)?.textContent),
  );
  assert(vendorDescriptions.includes('Vendor validation help'));
  assert(vendorDescriptions.some((text) => text?.includes('Email required')));
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
  await page.getByRole('button', { name: 'Show extensions', exact: true }).click();
  await page.locator('#remote-grid .dx-data-row').getByText('A', { exact: true }).waitFor();
  await page.getByRole('button', { name: 'Focus trigger', exact: true }).click();
  assert.equal(await page.getByRole('button', { name: 'Open panel', exact: true }).evaluate((el) => el === document.activeElement), true);
  await page.getByRole('button', { name: 'Open panel', exact: true }).click();
  await page.getByRole('button', { name: 'Close panel', exact: true }).click();
  await page.getByRole('button', { name: 'Filter remote', exact: true }).click();
  await page.locator('#remote-grid .dx-data-row').getByText('B', { exact: true }).waitFor();
  assert.deepEqual(JSON.parse(await page.locator('#remote-load').textContent()).filter, ['name', '=', 'B']);
  await page.getByRole('button', { name: 'Refresh remote', exact: true }).click();
  await page.locator('#extensions .dx-step').last().click();
  assert.equal(await page.locator('#extensions .dx-step-selected').count(), 1);
  assert.equal(await page.locator('#extensions .dx-step').first().evaluate((el) => el.classList.contains('dx-step-selected')), true);
  await page.getByRole('button', { name: 'Advance progress', exact: true }).click();
  await page.waitForFunction(() => document.querySelector('#extensions .dx-step:last-child').classList.contains('dx-step-selected'));
  assert.deepEqual(errors, []);
  console.log(
    'PASS: packed consumer types, production build, controls, accessibility, validation, overlays, tabs, accordion, grid selection/filter/header filter/paging/custom cells.',
  );
} finally {
  await browser?.close();
  await server?.close();
  rmSync(temp, { recursive: true, force: true });
}
