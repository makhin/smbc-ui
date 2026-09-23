import DxControl, {
  type ITagBoxOptions as DxProps,
} from 'devextreme-react/tag-box';
import { useControlAccessibility } from './Field.js';
import type {
  InputEditorProps,
  EditorDevExtremeProps,
  OptionProps,
} from './editor-types.js';
export type MultiSelectProps<T = string, TOption = T> = InputEditorProps<T[]> &
  OptionProps<TOption> & {
    searchable?: boolean;
    clearable?: boolean;
    applyMode?: 'instant' | 'buttons';
    selectionControls?: boolean;

    devExtremeProps?: EditorDevExtremeProps<
      DxProps,
      | 'placeholder'
      | 'items'
      | 'displayExpr'
      | 'valueExpr'
      | 'searchEnabled'
      | 'showClearButton'
      | 'applyValueMode'
      | 'showSelectionControls'
    >;
  };
export function MultiSelect<T = string, TOption = T>(
  props: MultiSelectProps<T, TOption>,
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
    applyMode,
    selectionControls,
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
      applyValueMode={applyMode === 'buttons' ? 'useButtons' : 'instantly'}
      showSelectionControls={selectionControls}
      {...(value !== undefined ? { value } : {})}
      {...(defaultValue !== undefined ? { defaultValue } : {})}
      inputAttr={accessibility.attrs}
      {...accessibility.validationProps}
      onValueChanged={(event) => onChange?.(event.value as T[])}
    >
      {children}
    </DxControl>
  );
}
