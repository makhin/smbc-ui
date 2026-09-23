import DxControl, {
  type IDateBoxOptions as DxProps,
} from 'devextreme-react/date-box';
import type { ReactNode } from 'react';
import { useControlAccessibility, type ControlAccessibility } from './Field.js';
export type DatePickerProps = ControlAccessibility & {
  value?: Date | string | number | null;
  defaultValue?: Date | string | number | null;
  onChange?: (value: Date | string | number | null) => void;
  disabled?: boolean;
  readOnly?: boolean;
  placeholder?: string;
  children?: ReactNode;

  displayFormat?: DxProps['displayFormat'];
  min?: DxProps['min'];
  max?: DxProps['max'];
  devExtremeProps?: Omit<
    DxProps,
    'value' | 'defaultValue' | 'onValueChanged' | 'children'
  >;
};
export function DatePicker(props: DatePickerProps) {
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
    displayFormat,
    min,
    max,
  } = props;
  const accessibility = useControlAccessibility(
    { id, ariaLabel, required, error, externalValidation: 'error' in props },
    devExtremeProps?.inputAttr,
  );
  return (
    <DxControl
      {...devExtremeProps}
      type="date"
      displayFormat={displayFormat}
      min={min}
      max={max}
      disabled={disabled}
      readOnly={readOnly}
      placeholder={placeholder}
      {...(value !== undefined ? { value } : {})}
      {...(defaultValue !== undefined ? { defaultValue } : {})}
      inputAttr={accessibility.attrs}
      {...accessibility.validationProps}
      onValueChanged={(event) =>
        onChange?.(event.value as Date | string | number | null)
      }
    >
      {children}
    </DxControl>
  );
}
