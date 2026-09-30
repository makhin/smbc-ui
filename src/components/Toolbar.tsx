import DxToolbar, {
  Item,
  type IToolbarOptions as DxProps,
} from 'devextreme-react/toolbar';

export type ToolbarProps = Pick<DxProps, 'items' | 'children' | 'disabled' | 'width'> & {
  devExtremeProps?: Omit<DxProps, 'items' | 'children' | 'disabled' | 'width'>;
};

function ToolbarRoot({ devExtremeProps, ...props }: ToolbarProps) {
  return <DxToolbar {...devExtremeProps} {...props} />;
}

export const Toolbar = Object.assign(ToolbarRoot, { Item });
