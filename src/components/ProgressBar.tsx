import DxProgressBar, {
  type IProgressBarOptions as DxProps,
} from 'devextreme-react/progress-bar';

export type ProgressBarProps = {
  value: number;
  ariaLabel: string;
  min?: number;
  max?: number;
  showStatus?: boolean;
  devExtremeProps?: Omit<DxProps, 'value' | 'defaultValue' | 'onValueChange' | 'min' | 'max' | 'showStatus'>;
};

export function ProgressBar({ value, ariaLabel, min = 0, max = 100, showStatus = true, devExtremeProps }: ProgressBarProps) {
  return (
    <DxProgressBar
      {...devExtremeProps}
      value={value}
      min={min}
      max={max}
      showStatus={showStatus}
      elementAttr={{ ...devExtremeProps?.elementAttr, 'aria-label': ariaLabel }}
    />
  );
}
