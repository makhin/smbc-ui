import DxControl, {
  type IRadioGroupOptions as DxProps,
} from 'devextreme-react/radio-group';
import { useControlAccessibility } from './Field.js';
import type {
  EditorProps,
  EditorDevExtremeProps,
  OptionProps,
} from './editor-types.js';
export type RadioGroupProps<T = string, TOption = T> = EditorProps<T> &
  OptionProps<TOption> & {
    orientation?: 'horizontal' | 'vertical';

    devExtremeProps?: EditorDevExtremeProps<
      DxProps,
      'items' | 'displayExpr' | 'valueExpr' | 'layout'
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
    disabled,
    readOnly,
    options,
    optionLabel,
    optionValue,
    orientation,
  } = props;
  const accessibility = useControlAccessibility(
    props,
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
