import DxControl, {
  type ITagBoxOptions as DxProps,
} from 'devextreme-react/tag-box';
import type { ReactNode } from 'react';
import { useControlAccessibility, type ControlAccessibility } from './Field.js';
export type MultiSelectProps<T = string, TOption = T> = ControlAccessibility & {
  value?: T[];
  defaultValue?: T[];
  onChange?: (value: T[]) => void;
  disabled?: boolean;
  readOnly?: boolean;
  placeholder?: string;
  children?: ReactNode;
  options: readonly TOption[];
  optionLabel?: string | ((item: TOption) => string);
  optionValue?: string;
  searchable?: boolean;
  clearable?: boolean;
  applyMode?: 'instant' | 'buttons';
  selectionControls?: boolean;

  devExtremeProps?: Omit<
    DxProps,
    'value' | 'defaultValue' | 'onValueChanged' | 'children'
  >;
};
export function MultiSelect<T = string, TOption = T>(
  props: MultiSelectProps<T, TOption>,
) {
  const {
    value,
    defaultValue,
    onChange,
    children,
    devExtremeProps,
    id,
    ariaLabel,
    required,
    error,
    disabled,
    readOnly,
    placeholder,
    options,
    optionLabel,
    optionValue,
    searchable,
    clearable,
    applyMode,
    selectionControls,
  } = props;
  const accessibility = useControlAccessibility(
    { id, ariaLabel, required, error, externalValidation: 'error' in props },
    devExtremeProps?.inputAttr,
  );
  return (
    <DxControl
      {...devExtremeProps}
      disabled={disabled}
      readOnly={readOnly}
      placeholder={placeholder}
      items={options.slice()}
      displayExpr={optionLabel}
      valueExpr={optionValue}
      searchEnabled={searchable}
      showClearButton={clearable}
      applyValueMode={applyMode === 'buttons' ? 'useButtons' : 'instantly'}
      showSelectionControls={selectionControls}
      {...(value !== undefined ? { value } : {})}
      {...(defaultValue !== undefined ? { defaultValue } : {})}
      inputAttr={accessibility.attrs}
      {...accessibility.validationProps}
      onValueChanged={(event) => onChange?.(event.value as T[])}
    >
      {children}
    </DxControl>
  );
}
