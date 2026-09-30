import type { ReactNode } from 'react';
import { Dialog, type DialogProps } from './Dialog.js';
import { Button, type ButtonVariant } from './Button.js';
export type ConfirmDialogProps = Omit<DialogProps, 'children' | 'onClose'> & {
  message: ReactNode;
  description?: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  confirmVariant?: ButtonVariant;
  onConfirm: () => void;
  onCancel: () => void;
};
export function ConfirmDialog({
  message,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  confirmVariant = 'primary',
  onConfirm,
  onCancel,
  ...props
}: ConfirmDialogProps) {
  return (
    <Dialog {...props} onClose={onCancel}>
      <div className="ui:flex ui:flex-col ui:gap-3 ui:py-4">
        <p>{message}</p>
        {description && <p className="ui:text-fg-muted">{description}</p>}
        <div className="ui:flex ui:flex-wrap ui:justify-end ui:gap-2 ui:mt-3 ui:pt-3 ui:border-t-[length:var(--border-width-default)] ui:border-border">
          <Button variant="tertiary" onClick={onCancel}>
            {cancelLabel}
          </Button>
          <Button variant={confirmVariant} onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
