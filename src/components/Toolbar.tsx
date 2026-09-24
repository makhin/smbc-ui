import DxToolbar, {
  Item,
  type IToolbarOptions as DxProps,
} from 'devextreme-react/toolbar';
import type { HTMLAttributes } from 'react';

export type ToolbarProps = Pick<DxProps, 'items' | 'children' | 'disabled' | 'width'> & {
  devExtremeProps?: Omit<DxProps, 'items' | 'children' | 'disabled' | 'width'>;
};

function ToolbarRoot({ devExtremeProps, ...props }: ToolbarProps) {
  return <DxToolbar {...devExtremeProps} {...props} />;
}

function ToolbarGroup({ className = '', ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div {...props} className={`smbc-ui-toolbar__group ${className}`.trim()} />;
}

export const Toolbar = Object.assign(ToolbarRoot, { Item, Group: ToolbarGroup });
