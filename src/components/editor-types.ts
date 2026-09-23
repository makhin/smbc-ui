import type { ReactNode } from 'react';
import type { ControlAccessibility } from './Field.js';

export type ValueProps<T> = {
  value?: T;
  defaultValue?: T;
  onChange?: (value: T) => void;
};

export type EditorProps<T> = ValueProps<T> &
  ControlAccessibility & {
    disabled?: boolean;
    readOnly?: boolean;
    children?: ReactNode;
  };

export type InputEditorProps<T> = EditorProps<T> & {
  placeholder?: string;
};

export type OptionProps<TOption> = {
  options: readonly TOption[];
  optionLabel?: string | ((item: TOption) => string);
  optionValue?: string;
};

export type EditorDevExtremeProps<
  DxProps,
  OwnedKeys extends keyof DxProps = never,
> = Omit<
  DxProps,
  | 'value'
  | 'defaultValue'
  | 'onValueChanged'
  | 'children'
  | 'disabled'
  | 'readOnly'
  | OwnedKeys
>;
