import DxControl, {
  type ICheckBoxOptions as DxProps,
} from 'devextreme-react/check-box';
import { useControlAccessibility } from './Field.js';
import type { EditorProps, EditorDevExtremeProps } from './editor-types.js';
export type CheckboxProps = EditorProps<boolean | null> & {
  label?: string;

  devExtremeProps?: EditorDevExtremeProps<DxProps, 'text'>;
};
export function Checkbox(props: CheckboxProps) {
  const {
    value,
    defaultValue,
    onChange,
    children,
    devExtremeProps,
    disabled,
    readOnly,
    label,
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
