import DxControl, {
  type ITextAreaOptions as DxProps,
} from 'devextreme-react/text-area';
import { useControlAccessibility } from './Field.js';
import type {
  InputEditorProps,
  EditorDevExtremeProps,
} from './editor-types.js';
export type TextAreaProps = InputEditorProps<string> & {
  height?: DxProps['height'];
  devExtremeProps?: EditorDevExtremeProps<DxProps, 'placeholder' | 'height'>;
};
export function TextArea(props: TextAreaProps) {
  const {
    value,
    defaultValue,
    onChange,
    children,
    devExtremeProps,
    disabled,
    readOnly,
    placeholder,
    height,
  } = props;
  const accessibility = useControlAccessibility(
    props,
    devExtremeProps?.inputAttr,
  );
  return (
    <DxControl
      {...devExtremeProps}
      height={height}
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
