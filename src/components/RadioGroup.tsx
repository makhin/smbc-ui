import DxControl, {
  type IRadioGroupOptions as DxProps,
} from 'devextreme-react/radio-group';
import type { ReactNode } from 'react';
import { useControlAccessibility, type ControlAccessibility } from './Field.js';
export type RadioGroupProps<T = string, TOption = T> = ControlAccessibility & {
  value?: T;
  defaultValue?: T;
  onChange?: (value: T) => void;
  disabled?: boolean;
  readOnly?: boolean;
  children?: ReactNode;
  options: readonly TOption[];
  optionLabel?: string | ((item: TOption) => string);
  optionValue?: string;
  orientation?: 'horizontal' | 'vertical';

  devExtremeProps?: Omit<
    DxProps,
    'value' | 'defaultValue' | 'onValueChanged' | 'children'
  >;
};
export function RadioGroup<T = string, TOption = T>(
  props: RadioGroupProps<T, TOption>,
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
    options,
    optionLabel,
    optionValue,
    orientation,
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
      items={options.slice()}
      displayExpr={optionLabel}
      valueExpr={optionValue}
      layout={orientation}
      {...(value !== undefined ? { value } : {})}
      {...(defaultValue !== undefined ? { defaultValue } : {})}
      elementAttr={accessibility.attrs}
      {...accessibility.validationProps}
      onValueChanged={(event) => onChange?.(event.value as T)}
    >
      {children}
    </DxControl>
  );
}
