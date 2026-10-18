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
    onSelectionChanging={(event) => { if (readOnly && event.addedItems[0] !== items?.[selectedIndex]) event.cancel = true; }} />;
}
