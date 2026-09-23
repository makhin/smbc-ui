import DxControl, {
  type INumberBoxOptions as DxProps,
} from 'devextreme-react/number-box';
import type { ReactNode } from 'react';
import { useControlAccessibility, type ControlAccessibility } from './Field.js';
export type NumberInputProps = ControlAccessibility & {
  value?: number | null;
  defaultValue?: number | null;
  onChange?: (value: number | null) => void;
  disabled?: boolean;
  readOnly?: boolean;
  placeholder?: string;
  children?: ReactNode;

  format?: DxProps['format'];
  min?: DxProps['min'];
  max?: DxProps['max'];
  step?: DxProps['step'];
  showSpinButtons?: DxProps['showSpinButtons'];
  devExtremeProps?: Omit<
    DxProps,
    'value' | 'defaultValue' | 'onValueChanged' | 'children'
  >;
};
export function NumberInput(props: NumberInputProps) {
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
    format,
    min,
    max,
    step,
    showSpinButtons,
  } = props;
  const accessibility = useControlAccessibility(
    { id, ariaLabel, required, error, externalValidation: 'error' in props },
    devExtremeProps?.inputAttr,
  );
  // DevExtreme emits/accepts null when cleared although its 26.1 declaration excludes it.
  return (
    <DxControl
      {...devExtremeProps}
      format={format}
      min={min}
      max={max}
      step={step}
      showSpinButtons={showSpinButtons}
      disabled={disabled}
      readOnly={readOnly}
      placeholder={placeholder}
      {...(value !== undefined ? { value: value as number } : {})}
      {...(defaultValue !== undefined
        ? { defaultValue: defaultValue as number }
        : {})}
      inputAttr={accessibility.attrs}
      {...accessibility.validationProps}
      onValueChanged={(event) => onChange?.(event.value as number | null)}
    >
      {children}
    </DxControl>
  );
}
