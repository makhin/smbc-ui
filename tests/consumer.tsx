import { useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  Button,
  Field,
  TextInput,
  TextArea,
  NumberInput,
  Select,
  MultiSelect,
  DatePicker,
  Checkbox,
  RadioGroup,
  Tabs,
  Accordion,
  DataGrid,
  Dialog,
  ConfirmDialog,
  Toast,
  LoadingIndicator,
  StatusBadge,
  Card,
  Callout,
  EmptyState,
  KpiCard,
  Toolbar,
  FilterPanel,
} from '@smbc/ui';
import {
  DataGridColumn,
  DataGridFilterRow,
  DataGridHeaderFilter,
  DataGridSelection,
  DataGridPaging,
  DataGridPager,
} from '@smbc/ui/data-grid';
import {
  Validator,
  RequiredRule,
  EmailRule,
  RangeRule,
  ValidationGroup,
  ValidationSummary,
} from '@smbc/ui/validation';
import '@smbc/ui/styles.css';
import '@smbc/devextreme-theme/styles.css';
// Stable configuration matches the Golden Source and preserves vendor keyboard focus.
const tabItems = [{ text: 'First' }, { text: 'Second' }];
const accordionItems = [
  { title: 'Alpha', text: 'Alpha body' },
  { title: 'Beta', text: 'Beta body' },
];
const gridRows = [
  { id: 1, name: 'A' },
  { id: 2, name: 'B' },
  { id: 3, name: 'C' },
];
function App() {
  const [externalError, setExternalError] = useState('Server error');
  const [teams, setTeams] = useState(['One']);
  const [value, setValue] = useState('Initial');
  const [selected, setSelected] = useState<string | null>('One');
  const [checked, setChecked] = useState<boolean | null>(false);
  const [tab, setTab] = useState(0);
  const [accordion, setAccordion] = useState(0);
  const [dialog, setDialog] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [toast, setToast] = useState(false);
  const [keys, setKeys] = useState<number[]>([]);
  const [count, setCount] = useState(0);
  const [amount, setAmount] = useState<number | null>(1);
  return (
    <>
      <Button onClick={() => setCount(count + 1)}>Count</Button>
      <output id="count">{count}</output>
      <Button icon="refresh" ariaLabel="Refresh" />
      <Button disabled onClick={() => setCount(99)}>
        Disabled
      </Button>
      <Field label="Reference" help="Reference help">
        <TextInput value={value} onChange={setValue} />
      </Field>
      <output id="value">{value}</output>
      <Field label="Default">
        <TextInput defaultValue="Uncontrolled" />
      </Field>
      <Field label="Read only">
        <TextInput value="Fixed" readOnly />
      </Field>
      <Field
        label="Invalid"
        error={externalError}
        help="Always available help"
        required
      >
        <TextInput />
      </Field>
      <Button onClick={() => setExternalError('')}>Clear error</Button>
      <Field label="Note">
        <TextArea defaultValue="Note" />
      </Field>
      <Field label="Amount">
        <NumberInput value={amount} onChange={setAmount} />
      </Field>
      <output id="amount">{String(amount)}</output>
      <Field label="Choice">
        <Select
          options={['One', 'Two']}
          value={selected}
          onChange={setSelected}
          searchable
        />
      </Field>
      <output id="choice">{selected}</output>
      <Field label="Teams">
        <MultiSelect
          options={['One', 'Two']}
          defaultValue={['One']}
          onChange={setTeams}
          applyMode="buttons"
          selectionControls
          searchable
        />
      </Field>
      <output id="teams">{teams.join(',')}</output>
      <Field label="Date">
        <DatePicker
          defaultValue={new Date(2026, 0, 1)}
          displayFormat="yyyy-MM-dd"
        />
      </Field>
      <Checkbox label="Accept" value={checked} onChange={setChecked} />
      <output id="checked">{String(checked)}</output>
      <Field label="Priority">
        <RadioGroup options={['Low', 'High']} defaultValue="Low" />
      </Field>
      <Tabs
        ariaLabel="Example tabs"
        items={tabItems}
        selectedIndex={tab}
        onChange={setTab}
      />
      <output id="tab">{tab}</output>
      <Accordion
        items={accordionItems}
        selectedIndex={accordion}
        onChange={setAccordion}
        collapsible
      />
      <output id="accordion">{accordion}</output>
      <Button onClick={() => setDialog(true)}>Open</Button>
      <Dialog
        open={dialog}
        title="Dialog title"
        onClose={() => setDialog(false)}
      >
        <Button onClick={() => setDialog(false)}>Close content</Button>
      </Dialog>
      <Button onClick={() => setConfirm(true)}>Confirm action</Button>
      <ConfirmDialog
        open={confirm}
        title="Delete item?"
        message="Cannot undo"
        confirmLabel="Delete"
        confirmVariant="danger"
        onCancel={() => setConfirm(false)}
        onConfirm={() => {
          setConfirm(false);
          setToast(true);
        }}
      />
      <Toast
        open={toast}
        message="Deleted"
        duration={500}
        onClose={() => setToast(false)}
      />
      <output id="toast">{String(toast)}</output>
      <div role="status">
        Loading
        <LoadingIndicator />
      </div>
      <Card>
        <Card.Body>
          <StatusBadge tone="warning">Review</StatusBadge>
        </Card.Body>
      </Card>
      <Callout tone="danger" title="Error">
        Details
      </Callout>
      <EmptyState title="No results" icon="search" />
      <KpiCard label="Count" value={1} />
      <Toolbar>
        <Toolbar.Group>Actions</Toolbar.Group>
      </Toolbar>
      <FilterPanel>Filters</FilterPanel>
      <form onSubmit={(e) => e.preventDefault()}>
        <ValidationGroup>
          <Field label="Email" required>
            <TextInput>
              <Validator>
                <RequiredRule message="Email required" />
                <EmailRule />
              </Validator>
            </TextInput>
          </Field>
          <Field label="Limit">
            <NumberInput defaultValue={0}>
              <Validator>
                <RangeRule min={10} message="Minimum ten" />
              </Validator>
            </NumberInput>
          </Field>
          <ValidationSummary />
          <Button submit>Validate</Button>
        </ValidationGroup>
      </form>
      <DataGrid
        dataSource={gridRows}
        keyExpr="id"
        selectedRowKeys={keys}
        onSelectionChange={setKeys}
      >
        <DataGridColumn dataField="name" />
        <DataGridColumn
          caption="Custom"
          cellRender={() => <StatusBadge>Cell</StatusBadge>}
        />
        <DataGridFilterRow visible />
        <DataGridHeaderFilter visible />
        <DataGridSelection mode="multiple" showCheckBoxesMode="always" />
        <DataGridPaging defaultPageSize={2} />
        <DataGridPager visible />
      </DataGrid>
      <output id="keys">{keys.join(',')}</output>
    </>
  );
}
createRoot(document.getElementById('root')!).render(<App />);
