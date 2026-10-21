import DxStepper, { type IStepperOptions as DxProps } from 'devextreme-react/stepper';

export type StepperProps = {
  items: DxProps['items'];
  selectedIndex: number;
  readOnly?: boolean;
  devExtremeProps?: Omit<DxProps, 'items' | 'selectedIndex' | 'onSelectionChanging'>;
};
export function Stepper({ items, selectedIndex, readOnly = false, devExtremeProps }: StepperProps) {
  return <DxStepper {...devExtremeProps} items={items} selectedIndex={selectedIndex}
    activeStateEnabled={readOnly ? false : devExtremeProps?.activeStateEnabled}
    focusStateEnabled={readOnly ? false : devExtremeProps?.focusStateEnabled}
    hoverStateEnabled={readOnly ? false : devExtremeProps?.hoverStateEnabled}
    onSelectionChanging={(event) => {
      // DevExtreme applies selectedIndex before replacing React event handlers.
      // Read the widget's target index so controlled updates are allowed while
      // user selection of a different item remains blocked in read-only mode.
      const index = event.component.option('selectedIndex') ?? -1;
      if (readOnly && event.addedItems[0] !== event.component.option('items')?.[index]) event.cancel = true;
    }} />;
}
