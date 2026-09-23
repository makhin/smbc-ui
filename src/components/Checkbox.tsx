import DxControl, {
  type ICheckBoxOptions as DxProps,
} from 'devextreme-react/check-box';
import type { ReactNode } from 'react';
import { useControlAccessibility, type ControlAccessibility } from './Field.js';
export type CheckboxProps = ControlAccessibility & {
  value?: boolean | null;
  defaultValue?: boolean | null;
  onChange?: (value: boolean | null) => void;
  disabled?: boolean;
  readOnly?: boolean;
  children?: ReactNode;
  label?: string;

  devExtremeProps?: Omit<
    DxProps,
    'value' | 'defaultValue' | 'onValueChanged' | 'children'
  >;
};
export function Checkbox(props: CheckboxProps) {
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
    label,
  } = props;
  const accessibility = useControlAccessibility(
    { id, ariaLabel, required, error, externalValidation: 'error' in props },
    devExtremeProps?.elementAttr,
  );
  return (
    <DxControl
      {...devExtremeProps}
      disabled={disabled}
      readOnly={readOnly}
      text={label}
      {...(value !== undefined ? { value } : {})}
      {...(defaultValue !== undefined ? { defaultValue } : {})}
      elementAttr={accessibility.attrs}
      {...accessibility.validationProps}
      onValueChanged={(event) => onChange?.(event.value as boolean | null)}
    >
      {children}
    </DxControl>
  );
}
