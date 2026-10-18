import { useImperativeHandle, useRef, type Ref } from 'react';
import DxButton, {
  type ButtonRef as DxButtonRef,
  type IButtonOptions as DxProps,
} from 'devextreme-react/button';
export type ButtonRef = { focus: () => void };
export type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'danger';
type Label =
  | { children: string; ariaLabel?: string }
  | { children?: never; ariaLabel: string };
export type ButtonProps = Label & {
  ref?: Ref<ButtonRef>;
  variant?: ButtonVariant;
  icon?: string;
  disabled?: boolean;
  onClick?: () => void;
  submit?: boolean;
  width?: number | string;
  devExtremeProps?: Omit<
    DxProps,
    | 'text'
    | 'children'
    | 'onClick'
    | 'disabled'
    | 'icon'
    | 'useSubmitBehavior'
    | 'width'
    | 'stylingMode'
  >;
};
export function Button({
  ref,
  children,
  ariaLabel,
  variant,
  icon,
  disabled,
  onClick,
  submit,
  width,
  devExtremeProps,
}: ButtonProps) {
  const controlRef = useRef<DxButtonRef>(null);
  useImperativeHandle(ref, () => ({ focus: () => controlRef.current?.instance().focus() }), []);
  if (!children && !ariaLabel?.trim())
    throw new Error('An icon-only Button requires ariaLabel.');
  return (
    <DxButton
      ref={controlRef}
      {...devExtremeProps}
      text={children}
      icon={icon}
      disabled={disabled}
      width={width}
      type={
        devExtremeProps?.type ??
        (variant === 'danger'
          ? 'danger'
          : variant === 'primary' || variant === 'secondary'
            ? 'default'
            : 'normal')
      }
      stylingMode={
        variant === 'secondary'
          ? 'outlined'
          : variant === 'tertiary'
            ? 'text'
            : 'contained'
      }
      hint={ariaLabel ?? devExtremeProps?.hint}
      elementAttr={{
        ...devExtremeProps?.elementAttr,
        ...(ariaLabel ? { 'aria-label': ariaLabel } : {}),
      }}
      useSubmitBehavior={submit}
      onClick={() => onClick?.()}
    />
  );
}
