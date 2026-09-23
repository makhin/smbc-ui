import DxLoadIndicator, {
  type ILoadIndicatorOptions as DxProps,
} from 'devextreme-react/load-indicator';
export type LoadingIndicatorProps = {
  size?: number;
  ariaLabel?: string;
  devExtremeProps?: DxProps;
};
export function LoadingIndicator({
  size = 24,
  ariaLabel,
  devExtremeProps,
}: LoadingIndicatorProps) {
  return (
    <DxLoadIndicator
      {...devExtremeProps}
      height={size}
      width={size}
      elementAttr={{
        ...devExtremeProps?.elementAttr,
        ...(ariaLabel
          ? { role: 'status', 'aria-label': ariaLabel }
          : { 'aria-hidden': 'true' }),
      }}
    />
  );
}
