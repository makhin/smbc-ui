import DxPopup, { type IPopupOptions as DxProps } from 'devextreme-react/popup';
import type { ReactNode } from 'react';
export type DialogProps = {
  open: boolean;
  title: string;
  children?: ReactNode;
  onClose: () => void;
  width?: number | string;
  closeOnOutsideClick?: boolean;
  showCloseButton?: boolean;
  devExtremeProps?: Omit<
    DxProps,
    | 'visible'
    | 'title'
    | 'children'
    | 'onHiding'
    | 'width'
    | 'showCloseButton'
    | 'hideOnOutsideClick'
  >;
};
export function Dialog({
  open,
  title,
  children,
  onClose,
  width = 600,
  closeOnOutsideClick = false,
  showCloseButton = true,
  devExtremeProps,
}: DialogProps) {
  return (
    <DxPopup
      height="auto"
      maxWidth="calc(100vw - 32px)"
      dragEnabled={false}
      {...devExtremeProps}
      elementAttr={{
        ...devExtremeProps?.elementAttr,
        class: `smbc-ui-overlay-host ${devExtremeProps?.elementAttr?.class ?? ''}`,
      }}
      visible={open}
      title={title}
      width={width}
      showCloseButton={showCloseButton}
      hideOnOutsideClick={closeOnOutsideClick}
      onHiding={onClose}
    >
      {children}
    </DxPopup>
  );
}
