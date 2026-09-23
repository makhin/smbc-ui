// Compile-only consumer: imports the installed archive, never the source tree.
import {
  TextInput,
  TextArea,
  NumberInput,
  DatePicker,
  Select,
  MultiSelect,
  Checkbox,
  RadioGroup,
  Button,
  Dialog,
  ConfirmDialog,
  LoadingIndicator,
  Tabs,
  DataGrid,
  type TextInputProps,
  type TextAreaProps,
  type NumberInputProps,
  type DatePickerProps,
  type SelectProps,
  type MultiSelectProps,
  type CheckboxProps,
  type RadioGroupProps,
} from '@smbc/ui';

type Equal<A, B> =
  (<T>() => T extends A ? 1 : 2) extends <T>() => T extends B ? 1 : 2
    ? true
    : false;
type Assert<T extends true> = T;
type ValueContract<
  P extends { value?: unknown; defaultValue?: unknown; onChange?: unknown },
> = Pick<P, 'value' | 'defaultValue' | 'onChange'>;
type Expected<T> = {
  value?: T;
  defaultValue?: T;
  onChange?: (value: T) => void;
};
type Contracts = [
  Assert<Equal<ValueContract<TextInputProps>, Expected<string>>>,
  Assert<Equal<ValueContract<TextAreaProps>, Expected<string>>>,
  Assert<Equal<ValueContract<NumberInputProps>, Expected<number | null>>>,
  Assert<
    Equal<
      ValueContract<DatePickerProps>,
      Expected<Date | string | number | null>
    >
  >,
  Assert<Equal<ValueContract<SelectProps<number>>, Expected<number | null>>>,
  Assert<Equal<ValueContract<MultiSelectProps<number>>, Expected<number[]>>>,
  Assert<Equal<ValueContract<CheckboxProps>, Expected<boolean | null>>>,
  Assert<Equal<ValueContract<RadioGroupProps<number>>, Expected<number>>>,
];

const options: readonly { id: number; name: string }[] = [
  { id: 1, name: 'One' },
];
<Select
  options={options}
  value={1}
  optionValue="id"
  optionLabel={(item) => item.name}
  onChange={(value) => {
    const valid: Assert<Equal<typeof value, number | null>> = true;
    void valid;
  }}
/>;
<MultiSelect
  options={options}
  defaultValue={[1]}
  optionValue="id"
  optionLabel="name"
  onChange={(value) => {
    const valid: Assert<Equal<typeof value, number[]>> = true;
    void valid;
  }}
/>;
<RadioGroup
  options={options}
  value={1}
  optionValue="id"
  optionLabel={(item) => item.name}
  onChange={(value) => {
    const valid: Assert<Equal<typeof value, number>> = true;
    void valid;
  }}
/>;
<Select options={['One', 'Two'] as const} />;
<NumberInput value={null} />;
<DatePicker value={null} defaultValue="2026-01-01" />;
<Checkbox defaultValue={null} />;
<TextArea defaultValue="Note" height={80} />;

// Working vendor extensions remain available.
<TextInput
  devExtremeProps={{
    inputAttr: { 'data-test': 'input' },
    valueChangeEvent: 'input',
    isValid: false,
    validationErrors: [{ message: 'Invalid' }],
  }}
/>;
<Select options={options} devExtremeProps={{ searchTimeout: 300 }} />;
<Checkbox devExtremeProps={{ elementAttr: { 'data-test': 'checkbox' } }} />;
<Button variant="secondary" devExtremeProps={{ type: 'normal', hint: 'Hint' }}>
  Action
</Button>;
<Dialog
  open
  title="Title"
  onClose={() => {}}
  devExtremeProps={{
    height: 400,
    maxWidth: 800,
    dragEnabled: true,
    elementAttr: { class: 'custom' },
  }}
/>;
<Tabs
  items={['One']}
  devExtremeProps={{
    onItemRendered: (event) => {
      void event.itemData;
    },
  }}
/>;
<DataGrid devExtremeProps={{ showBorders: true, columnAutoWidth: false }} />;

// Each formerly accepted, overwritten option must be rejected in an object literal.
// @ts-expect-error Use the top-level disabled prop.
<TextInput devExtremeProps={{ disabled: true }} />;
// @ts-expect-error Use the top-level readOnly prop.
<Checkbox devExtremeProps={{ readOnly: true }} />;
// @ts-expect-error Use the top-level placeholder prop.
<TextInput devExtremeProps={{ placeholder: 'Reference' }} />;
// @ts-expect-error Use the top-level height prop.
<TextArea devExtremeProps={{ height: 80 }} />;
// @ts-expect-error Use the top-level format prop.
<NumberInput devExtremeProps={{ format: '#0' }} />;
// @ts-expect-error Use the top-level min prop.
<NumberInput devExtremeProps={{ min: 0 }} />;
// @ts-expect-error Use the top-level max prop.
<NumberInput devExtremeProps={{ max: 10 }} />;
// @ts-expect-error Use the top-level step prop.
<NumberInput devExtremeProps={{ step: 2 }} />;
// @ts-expect-error Use the top-level showSpinButtons prop.
<NumberInput devExtremeProps={{ showSpinButtons: true }} />;
// @ts-expect-error DatePicker is date-only.
<DatePicker devExtremeProps={{ type: 'datetime' }} />;
// @ts-expect-error Use the top-level displayFormat prop.
<DatePicker devExtremeProps={{ displayFormat: 'yyyy-MM-dd' }} />;
// @ts-expect-error Use the top-level min prop.
<DatePicker devExtremeProps={{ min: new Date() }} />;
// @ts-expect-error Use the top-level max prop.
<DatePicker devExtremeProps={{ max: new Date() }} />;
// @ts-expect-error Use options.
<Select options={options} devExtremeProps={{ items: [] }} />;
// @ts-expect-error Use optionLabel.
<Select options={options} devExtremeProps={{ displayExpr: 'name' }} />;
// @ts-expect-error Use optionValue.
<Select options={options} devExtremeProps={{ valueExpr: 'id' }} />;
// @ts-expect-error Use searchable.
<Select options={options} devExtremeProps={{ searchEnabled: true }} />;
// @ts-expect-error Use clearable.
<Select options={options} devExtremeProps={{ showClearButton: true }} />;
<MultiSelect
  options={options}
  // @ts-expect-error Use applyMode="buttons".
  devExtremeProps={{ applyValueMode: 'useButtons' }}
/>;
<MultiSelect
  options={options}
  // @ts-expect-error Use selectionControls.
  devExtremeProps={{ showSelectionControls: true }}
/>;
// @ts-expect-error Use label.
<Checkbox devExtremeProps={{ text: 'Accept' }} />;
// @ts-expect-error Use options.
<RadioGroup options={options} devExtremeProps={{ items: [] }} />;
// @ts-expect-error Use optionLabel.
<RadioGroup options={options} devExtremeProps={{ displayExpr: 'name' }} />;
// @ts-expect-error Use optionValue.
<RadioGroup options={options} devExtremeProps={{ valueExpr: 'id' }} />;
// @ts-expect-error Use orientation.
<RadioGroup options={options} devExtremeProps={{ layout: 'horizontal' }} />;
// @ts-expect-error Use width.
<Button devExtremeProps={{ width: 100 }}>Action</Button>;
// @ts-expect-error Use variant.
<Button devExtremeProps={{ stylingMode: 'outlined' }}>Action</Button>;
<Dialog
  open
  title="Title"
  onClose={() => {}}
  // @ts-expect-error Use width.
  devExtremeProps={{ width: 100 }}
/>;
<Dialog
  open
  title="Title"
  onClose={() => {}}
  // @ts-expect-error Use showCloseButton.
  devExtremeProps={{ showCloseButton: false }}
/>;
<Dialog
  open
  title="Title"
  onClose={() => {}}
  // @ts-expect-error Use closeOnOutsideClick.
  devExtremeProps={{ hideOnOutsideClick: true }}
/>;
<ConfirmDialog
  open
  title="Title"
  message="Confirm?"
  onConfirm={() => {}}
  onCancel={() => {}}
  // @ts-expect-error ConfirmDialog inherits the Dialog contract.
  devExtremeProps={{ width: 100 }}
/>;
// @ts-expect-error Use size.
<LoadingIndicator devExtremeProps={{ width: 40 }} />;
// @ts-expect-error Use size.
<LoadingIndicator devExtremeProps={{ height: 40 }} />;

// Shared implementation details must not become root API.
// @ts-expect-error Internal helper types have no root export.
import type { EditorProps } from '@smbc/ui';
export type { Contracts };
