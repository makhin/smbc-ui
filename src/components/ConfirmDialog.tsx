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
      <div className="smbc-ui-dialog-body">
        <p>{message}</p>
        {description && <p className="smbc-ui-muted">{description}</p>}
        <div className="smbc-ui-dialog-actions">
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
