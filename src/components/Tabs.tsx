import DxTabs, { type ITabsOptions as DxProps } from 'devextreme-react/tabs';
export type TabsProps = {
  items: DxProps['items'];
  selectedIndex?: number;
  defaultSelectedIndex?: number;
  onChange?: (index: number) => void;
  ariaLabel?: string;
  devExtremeProps?: Omit<
    DxProps,
    'items' | 'selectedIndex' | 'defaultSelectedIndex' | 'onSelectionChanged'
  >;
};
export function Tabs({
  onChange,
  ariaLabel,
  devExtremeProps,
  ...props
}: TabsProps) {
  return (
    <DxTabs
      {...devExtremeProps}
      {...props}
      elementAttr={{
        ...devExtremeProps?.elementAttr,
        ...(ariaLabel ? { 'aria-label': ariaLabel } : {}),
      }}
      onItemRendered={(event) => {
        // Fluent's hidden sizing span can hide an unselected tab's accessible name.
        const label =
          typeof event.itemData === 'string'
            ? event.itemData
            : event.itemData?.text;
        if (typeof label === 'string')
          event.itemElement.setAttribute('aria-label', label);
        devExtremeProps?.onItemRendered?.(event);
      }}
      onSelectionChanged={(event) => {
        // Replacing item objects emits a transient removal before restoring selection.
        if (event.addedItems.length)
          onChange?.(event.component.option('selectedIndex') ?? -1);
      }}
    />
  );
}
