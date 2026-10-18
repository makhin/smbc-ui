import DxDrawer, { type IDrawerOptions as DxProps } from 'devextreme-react/drawer';
import type { ReactNode } from 'react';

export type DrawerProps = {
  open: boolean;
  onOpenChange?: (open: boolean) => void;
  panel: () => ReactNode;
  children?: ReactNode;
  devExtremeProps?: Omit<DxProps, 'opened' | 'onOpenedChange' | 'render' | 'component' | 'template' | 'children'>;
};
export function Drawer({ open, onOpenChange, panel, children, devExtremeProps }: DrawerProps) {
  return <DxDrawer {...devExtremeProps} opened={open} onOpenedChange={onOpenChange} render={panel}>{children}</DxDrawer>;
}
