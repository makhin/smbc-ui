import DxControl, {
  type ITextBoxOptions as DxProps,
} from 'devextreme-react/text-box';
import { useControlAccessibility } from './Field.js';
import type {
  InputEditorProps,
  EditorDevExtremeProps,
} from './editor-types.js';
export type TextInputProps = InputEditorProps<string> & {
  devExtremeProps?: EditorDevExtremeProps<DxProps, 'placeholder'>;
};
export function TextInput(props: TextInputProps) {
  const {
    value,
    defaultValue,
    onChange,
    children,
    devExtremeProps,
    disabled,
    readOnly,
    placeholder,
  } = props;
  const accessibility = useControlAccessibility(
    props,
    devExtremeProps?.inputAttr,
  );
  return (
    <DxControl
      {...devExtremeProps}
      disabled={disabled}
      readOnly={readOnly}
      placeholder={placeholder}
      {...(value !== undefined ? { value } : {})}
      {...(defaultValue !== undefined ? { defaultValue } : {})}
      inputAttr={accessibility.attrs}
      {...accessibility.validationProps}
      onValueChanged={(event) => onChange?.(event.value as string)}
    >
      {children}
    </DxControl>
  );
}
