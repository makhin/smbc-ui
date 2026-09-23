import DxControl, {
  type IDateBoxOptions as DxProps,
} from 'devextreme-react/date-box';
import { useControlAccessibility } from './Field.js';
import type {
  InputEditorProps,
  EditorDevExtremeProps,
} from './editor-types.js';
export type DatePickerProps = InputEditorProps<
  Date | string | number | null
> & {
  displayFormat?: DxProps['displayFormat'];
  min?: DxProps['min'];
  max?: DxProps['max'];
  devExtremeProps?: EditorDevExtremeProps<
    DxProps,
    'placeholder' | 'type' | 'displayFormat' | 'min' | 'max'
  >;
};
export function DatePicker(props: DatePickerProps) {
  const {
    value,
    defaultValue,
    onChange,
    children,
    devExtremeProps,
    disabled,
    readOnly,
    placeholder,
    displayFormat,
    min,
    max,
  } = props;
  const accessibility = useControlAccessibility(
    props,
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
