import DxButton, {
  type IButtonOptions as DxProps,
} from 'devextreme-react/button';
export type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'danger';
type Label =
  | { children: string; ariaLabel?: string }
  | { children?: never; ariaLabel: string };
export type ButtonProps = Label & {
  variant?: ButtonVariant;
  icon?: string;
  disabled?: boolean;
  onClick?: () => void;
  submit?: boolean;
  width?: number | string;
  devExtremeProps?: Omit<
    DxProps,
    'text' | 'children' | 'onClick' | 'disabled' | 'icon' | 'useSubmitBehavior'
  >;
};
export function Button({
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
  if (!children && !ariaLabel?.trim())
    throw new Error('An icon-only Button requires ariaLabel.');
  return (
    <DxButton
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
