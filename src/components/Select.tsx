import DxControl, {
  type ISelectBoxOptions as DxProps,
} from 'devextreme-react/select-box';
import type { ReactNode } from 'react';
import { useControlAccessibility, type ControlAccessibility } from './Field.js';
export type SelectProps<T = string, TOption = T> = ControlAccessibility & {
  value?: T | null;
  defaultValue?: T | null;
  onChange?: (value: T | null) => void;
  disabled?: boolean;
  readOnly?: boolean;
  placeholder?: string;
  children?: ReactNode;
  options: readonly TOption[];
  optionLabel?: string | ((item: TOption) => string);
  optionValue?: string;
  searchable?: boolean;
  clearable?: boolean;

  devExtremeProps?: Omit<
    DxProps,
    'value' | 'defaultValue' | 'onValueChanged' | 'children'
  >;
};
export function Select<T = string, TOption = T>(
  props: SelectProps<T, TOption>,
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
      {...(value !== undefined ? { value } : {})}
      {...(defaultValue !== undefined ? { defaultValue } : {})}
      inputAttr={accessibility.attrs}
      {...accessibility.validationProps}
      onValueChanged={(event) => onChange?.(event.value as T | null)}
    >
      {children}
    </DxControl>
  );
}
