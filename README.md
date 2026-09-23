# @smbc/ui

Reusable SMBC React components, version **0.1.0**. `makhin/smbc-style` is the
Golden Source and integration reference for `@smbc/ui`. Reflect public behavior
and visual changes in that application in the same change/release cycle.

## Installation

Use your approved internal registry (for example Nexus):

```sh
npm install @smbc/ui@0.1.0 @smbc/devextreme-theme@0.1.0 devextreme@26.1.4 devextreme-react@26.1.4 react@19.2.8 react-dom@19.2.8
```

Peer contracts: React/React DOM `^19.2.8`, DevExtreme/DevExtreme React `~26.1.4`,
SMBC theme `^0.1.0`. None of these runtimes is bundled. This is a browser React
library intended for an ESM bundler such as Vite; Node SSR is not a supported
v0.1 target. Use Vite's `vite/client` types for CSS imports in TypeScript.

Configure the approved `@smbc:registry` before publishing. `prepublishOnly`
rejects the public npm registry. Metadata uses `UNLICENSED`, `private: false`,
and restricted access; no public registry URL is configured. Publishing is an
explicit release operation, separate from building and packing.

## Styles and ownership

```ts
import '@smbc/ui/styles.css';
// Optional application typography/layout styles go here in the Golden Source.
import '@smbc/devextreme-theme/styles.css';
// Optional application shell styles follow the theme.
```

This order is tested against the Golden Source. Do not also load a stock
DevExtreme theme. UI CSS uses semantic theme variables and private `smbc-ui-*`
classes. It contains no theme import, global document reset or brand assets.
Use component props and composition rather than targeting private CSS classes.

**@smbc/ui does not own the SMBC theme.** `@smbc/devextreme-theme` owns tokens,
fonts, logo, favicon, generated DevExtreme CSS, overrides and visualization
palette. Applications still import assets/palette directly from that package.
Routing, business workflows, navigation, global typography and application
shells belong to applications. Charts remain an approved direct
`devextreme-react/chart` import; no chart abstraction is included in v0.1.

## Basic usage

```tsx
import { Button, Field, TextInput, Select } from '@smbc/ui';

<Field label="Reference" help="Use the external reference.">
  <TextInput value={reference} onChange={setReference} />
</Field>
<Select ariaLabel="Country" options={countries} value={country} onChange={setCountry} searchable />
<Button variant="primary" onClick={save}>Save</Button>
<Button icon="refresh" ariaLabel="Refresh" onClick={refresh} />
```

Editors support controlled `value`/`onChange(value)` or uncontrolled
`defaultValue`; wrappers do not maintain a second value state. Do not switch
between these modes during a mount. Callbacks preserve DevExtreme's commit
moment (normally editor change/blur). For a deliberate vendor-specific option,
use typed `devExtremeProps`, e.g. `searchTimeout: 300` or
`valueChangeEvent: 'input'`. Common props belong on the semantic API.

`Field` hosts one editor and associates label/help/error with its input or
composite root. Set `id` on Field for a stable id; otherwise it uses React
`useId`. `required` supplies the marker and ARIA metadata; rules are explicit
through the advanced validation API below. `error` on Field renders and
associates an external error and makes the editor invalid. Without Field, give
the control `ariaLabel` (or use the deliberate input/element attribute escape
hatch). Checkbox can use its visible `label`. `wide` spans two filter columns
until the narrow breakpoint.

## Root exports and mappings

| Export | Implementation / principal props |
|---|---|
| Button | DevExtreme Button; `variant`, `icon`, `ariaLabel`, `disabled`, `submit`, `onClick()` |
| TextInput / TextArea | TextBox / TextArea; string values, placeholder, readOnly, disabled; TextArea height |
| NumberInput | NumberBox; number or null, format, min/max/step, showSpinButtons |
| Select | SelectBox; options, searchable, clearable, optionLabel/optionValue, nullable selected value |
| MultiSelect | TagBox; array value, options, searchable, selectionControls, applyMode instant/buttons |
| DatePicker | DateBox in date mode; Date/string/number/null, displayFormat, min/max |
| Checkbox | CheckBox; boolean/null value, visible label |
| RadioGroup | RadioGroup; options, optionLabel/optionValue, orientation, value |
| Tabs | Tabs; items, selectedIndex/defaultSelectedIndex, onChange(index) |
| Accordion | Accordion; items, index or selectedItems, onChange/onItemsChange, multiple/collapsible |
| DataGrid | DataGrid; corporate defaults, dataSource/keyExpr/columns, selection keys |
| Dialog / ConfirmDialog | Popup; controlled open, onClose or onCancel/onConfirm |
| Toast | Toast; open, message, tone, duration, onClose |
| LoadingIndicator | LoadIndicator; size (24 default), optional ariaLabel |
| Card | Card.Header, Card.Title, Card.Body, Card.Footer composition |
| Field | Label/control/help/error association, required marker, wide |
| StatusBadge | neutral/info/warning/success/danger/brand tone |
| Callout | info/brand/warning/danger tone, optional title, children |
| EmptyState | icon, title, description, action; optional children |
| KpiCard | label, value, meta |
| Toolbar | Toolbar.Group composition |
| FilterPanel | Responsive four/two/one-column filter layout |
| TableShell | Shared border/overflow shell for a grid or native table |

Component Props types, ButtonVariant and StatusBadgeTone are exported as well.

Button variants map to primary=default/contained, secondary=default/outlined,
tertiary=normal/text, danger=danger/contained. Omitting variant preserves the
Golden Source neutral contained button. Text children are strings. Icon-only
buttons require `ariaLabel` at compile time and also fail at runtime when it is
missing. A typed escape hatch can preserve an explicitly neutral outlined
reference button (`devExtremeProps={{ type: 'normal' }}`).

Select/MultiSelect/RadioGroup accept generic value and option types. Object
options can use `optionLabel="name"` and `optionValue="id"`; string arrays need
neither. Empty NumberInput yields null, matching the vendor runtime despite
its overly narrow 26.1 TypeScript declaration. Tabs provide explicit accessible names for text items, including unselected tabs.
Keep item configuration objects stable (module constants or React useMemo)
when content is unchanged; replacing objects rebuilds vendor items and can
reset keyboard focus. Tabs/Accordion ignore transient removal events when their item objects are
replaced; user selection and accordion collapse still call the semantic callbacks.

Date values are not converted
or parsed by the wrapper; timezone/serialization policies remain app-owned.

LoadingIndicator is decorative by default; pair it with a textual `role="status"`
container. Only pass ariaLabel when it must announce itself independently.

```tsx
<Card>
  <Card.Header>
    <div><Card.Title>Summary</Card.Title></div>
    <StatusBadge tone="warning">Under review</StatusBadge>
  </Card.Header>
  <Card.Body>Content</Card.Body>
  <Card.Footer><Button variant="primary">Approve</Button></Card.Footer>
</Card>
```

## Dialog and toast

```tsx
<ConfirmDialog
  open={open}
  title="Delete item?"
  message="This action cannot be undone."
  confirmLabel="Delete"
  confirmVariant="danger"
  onConfirm={handleDelete}
  onCancel={() => setOpen(false)}
/>
<Toast open={saved} message="Saved." tone="success" onClose={() => setSaved(false)} />
```

The caller owns open state and closes a confirmation after successful action.
Dialog defaults: width 600, auto height, viewport max width, close button,
no dragging, no outside-click dismissal. Escape, focus trapping and keyboard
handling remain with DevExtreme. Toast defaults to 2500 ms and calls onClose
when hiding; update open state in that callback. No business workflow is hidden
inside either component.

## DataGrid and advanced subpath

```tsx
import { DataGrid, StatusBadge } from '@smbc/ui';
import {
  DataGridColumn, DataGridFilterRow, DataGridHeaderFilter,
  DataGridSelection, DataGridPaging, DataGridPager,
} from '@smbc/ui/data-grid';

<DataGrid dataSource={rows} keyExpr="id" onSelectionChange={setSelectedKeys}>
  <DataGridSelection mode="multiple" showCheckBoxesMode="always" />
  <DataGridFilterRow visible />
  <DataGridHeaderFilter visible />
  <DataGridPaging defaultPageSize={5} />
  <DataGridPager visible showInfo showPageSizeSelector allowedPageSizes={[5, 10, 20]} />
  <DataGridColumn dataField="reference" minWidth={130} />
  <DataGridColumn dataField="amount" dataType="number" alignment="right"
    format={{ type: 'fixedPoint', precision: 2 }} />
  <DataGridColumn dataField="status"
    cellRender={({ value }) => <StatusBadge>{value}</StatusBadge>} />
</DataGrid>
```

Defaults: showBorders=false, rowAlternationEnabled=true,
hoverStateEnabled=true, columnAutoWidth=true. Simple tables can supply columns
as a prop instead. Controlled selection uses selectedRowKeys and
onSelectionChange(keys). The `data-grid` entry point intentionally exposes the
six listed DevExtreme configuration aliases, not its entire configuration
surface. The wrapper's typed devExtremeProps is the advanced escape hatch.

## Validation (advanced)

Version 0.1 preserves the working vendor validation model rather than creating
another framework. Import only the required primitives through
`@smbc/ui/validation`: Validator, RequiredRule, EmailRule, RangeRule,
ValidationGroup, ValidationSummary.

```tsx
import { Field, TextInput, Button } from '@smbc/ui';
import { ValidationGroup, ValidationSummary, Validator, RequiredRule, EmailRule } from '@smbc/ui/validation';

<form onSubmit={event => event.preventDefault()}>
  <ValidationGroup>
    <Field label="Email" required>
      <TextInput>
        <Validator>
          <RequiredRule message="Enter an email." />
          <EmailRule message="Enter a valid email." />
        </Validator>
      </TextInput>
    </Field>
    <ValidationSummary />
    <Button submit variant="primary">Validate</Button>
  </ValidationGroup>
</form>
```

ValidationRule children remain vendor-coupled advanced configuration. External
validation can instead pass Field error without a Validator. Do not use Toast
for field validation. Avoid mixing two independent validation owners on the
same control.

## Development and packed integration

The local theme dependency uses `../devextreme-theme/smbc-devextreme-theme-0.1.0.tgz`.
Ensure the sibling archive exists, then:

```sh
npm ci
npm run typecheck
npm run build
npm run pack:check
# First browser setup only, when Chromium is not already installed:
npx playwright install chromium
npm test
npm pack
cd ../smbc-style
npm install ../smbc-ui/smbc-ui-0.1.0.tgz
npm run lint
npm run typecheck
npm run build
```

Build uses TypeScript ESM plus a CSS copy. `dist/` contains a root index,
components, data-grid and validation entry points, declaration files and
styles.css. `npm pack` builds automatically. Only dist, README and package
metadata ship. CSS is marked side-effectful for tree shaking; JS is not.

`npm test` packs the library, installs it and the theme into a temporary Vite
consumer, typechecks/builds that consumer and runs headless Chromium interaction
checks. It consumes the tarball, never source aliases or symlinks. The test
requires npm access/cache and the Playwright Chromium binary. Temporary
consumers are removed after success or failure.

Repack and explicitly reinstall after source changes, including same-version
local development. Commit the application manifest and lockfile together and
share the matching archive. Publishing is not needed for local integration.

## Versioning and next candidates

PATCH: compatible fixes; MINOR: compatible components/props; MAJOR: breaking
APIs. Explicitly document breaking changes even during 0.x. Do not turn every
vendor widget into a facade. Candidates for the next release are a semantic
validation-rules API, a reusable LoadingState and a shared field description
pattern for multiple related editors, once real consumers establish the need.
