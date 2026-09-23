import DxControl, {
  type INumberBoxOptions as DxProps,
} from 'devextreme-react/number-box';
import { useControlAccessibility } from './Field.js';
import type {
  InputEditorProps,
  EditorDevExtremeProps,
} from './editor-types.js';
export type NumberInputProps = InputEditorProps<number | null> & {
  format?: DxProps['format'];
  min?: DxProps['min'];
  max?: DxProps['max'];
  step?: DxProps['step'];
  showSpinButtons?: DxProps['showSpinButtons'];
  devExtremeProps?: EditorDevExtremeProps<
    DxProps,
    'placeholder' | 'format' | 'min' | 'max' | 'step' | 'showSpinButtons'
  >;
};
export function NumberInput(props: NumberInputProps) {
  const {
    value,
    defaultValue,
    onChange,
    children,
    devExtremeProps,
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
    props,
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
