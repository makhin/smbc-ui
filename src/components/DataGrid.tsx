import DxDataGrid, {
  type IDataGridOptions as DxProps,
} from 'devextreme-react/data-grid';
export type DataGridProps<T = unknown, K = unknown> = Pick<
  DxProps<T, K>,
  | 'dataSource'
  | 'keyExpr'
  | 'columns'
  | 'children'
  | 'selectedRowKeys'
  | 'defaultSelectedRowKeys'
> & {
  onSelectionChange?: (keys: K[]) => void;
  devExtremeProps?: Omit<
    DxProps<T, K>,
    | 'dataSource'
    | 'keyExpr'
    | 'columns'
    | 'children'
    | 'selectedRowKeys'
    | 'defaultSelectedRowKeys'
    | 'onSelectionChanged'
  >;
};
export function DataGrid<T = unknown, K = unknown>({
  onSelectionChange,
  devExtremeProps,
  ...props
}: DataGridProps<T, K>) {
  return (
    <DxDataGrid<T, K>
      showBorders={false}
      rowAlternationEnabled
      hoverStateEnabled
      columnAutoWidth
      {...devExtremeProps}
      {...props}
      onSelectionChanged={(event) => onSelectionChange?.(event.selectedRowKeys)}
    />
  );
}
