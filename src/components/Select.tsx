import DxControl, {
  type ISelectBoxOptions as DxProps,
} from 'devextreme-react/select-box';
import { useControlAccessibility } from './Field.js';
import type {
  InputEditorProps,
  EditorDevExtremeProps,
  OptionProps,
} from './editor-types.js';
export type SelectProps<T = string, TOption = T> = InputEditorProps<T | null> &
  OptionProps<TOption> & {
    searchable?: boolean;
    clearable?: boolean;

    devExtremeProps?: EditorDevExtremeProps<
      DxProps,
      | 'placeholder'
      | 'items'
      | 'displayExpr'
      | 'valueExpr'
      | 'searchEnabled'
      | 'showClearButton'
    >;
  };
export function Select<T = string, TOption = T>(
  props: SelectProps<T, TOption>,
) {
  const {
    value,
    defaultValue,
    onChange,
    children,
    devExtremeProps,
    disabled,
    readOnly,
    placeholder,
    options,
    optionLabel,
    optionValue,
    searchable,
    clearable,
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
      items={options.slice()}
      displayExpr={optionLabel}
      valueExpr={optionValue}
      searchEnabled={searchable}
      showClearButton={clearable}
      {...(value !== undefined ? { value } : {})}
      {...(defaultValue !== undefined ? { defaultValue } : {})}
      inputAttr={accessibility.attrs}
      {...accessibility.validationProps}
      onValueChanged={(event) => onChange?.(event.value as T | null)}
    >
      {children}
    </DxControl>
  );
}
