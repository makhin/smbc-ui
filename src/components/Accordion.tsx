import DxAccordion, {
  type IAccordionOptions as DxProps,
} from 'devextreme-react/accordion';
export type AccordionProps = {
  items: DxProps['items'];
  selectedIndex?: number;
  defaultSelectedIndex?: number;
  selectedItems?: DxProps['selectedItems'];
  defaultSelectedItems?: DxProps['defaultSelectedItems'];
  onChange?: (index: number) => void;
  onItemsChange?: (items: unknown[]) => void;
  collapsible?: boolean;
  multiple?: boolean;
  devExtremeProps?: Omit<
    DxProps,
    | 'items'
    | 'selectedIndex'
    | 'defaultSelectedIndex'
    | 'selectedItems'
    | 'defaultSelectedItems'
    | 'onSelectionChanged'
  >;
};
export function Accordion({
  onChange,
  onItemsChange,
  devExtremeProps,
  ...props
}: AccordionProps) {
  return (
    <DxAccordion
      {...devExtremeProps}
      {...props}
      onSelectionChanged={(event) => {
        // Ignore removal of objects from a previous items array, but keep user collapse.
        if (
          !event.addedItems.length &&
          event.removedItems.length &&
          !event.removedItems.some((item) => props.items?.includes(item))
        )
          return;
        onChange?.(event.component.option('selectedIndex') ?? -1);
        onItemsChange?.(event.component.option('selectedItems') ?? []);
      }}
    />
  );
}
