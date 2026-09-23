import DxToast, { type IToastOptions as DxProps } from 'devextreme-react/toast';
export type ToastProps = {
  open: boolean;
  message: string;
  tone?: 'info' | 'success' | 'warning' | 'error';
  duration?: number;
  onClose: () => void;
  devExtremeProps?: Omit<
    DxProps,
    'visible' | 'message' | 'type' | 'displayTime' | 'onHiding'
  >;
};
export function Toast({
  open,
  message,
  tone = 'info',
  duration = 2500,
  onClose,
  devExtremeProps,
}: ToastProps) {
  return (
    <DxToast
      {...devExtremeProps}
      elementAttr={{
        ...devExtremeProps?.elementAttr,
        class: `smbc-ui-overlay-host ${devExtremeProps?.elementAttr?.class ?? ''}`,
      }}
      visible={open}
      message={message}
      type={tone}
      displayTime={duration}
      onHiding={onClose}
    />
  );
}
