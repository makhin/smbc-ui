import {
  createContext,
  useContext,
  useId,
  useEffect,
  useRef,
  type HTMLAttributes,
  type ReactNode,
} from 'react';
type FieldContextValue = {
  id: string;
  labelId?: string;
  descriptionId?: string;
  required?: boolean;
  error?: string;
  externalValidation: boolean;
};
const FieldContext = createContext<FieldContextValue | undefined>(undefined);
export type FieldProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
  label?: ReactNode;
  children: ReactNode;
  help?: ReactNode;
  error?: string;
  required?: boolean;
  wide?: boolean;
};
export function Field(props: FieldProps) {
  const {
    id,
    label,
    children,
    help,
    error,
    required,
    wide,
    className = '',
    ...rest
  } = props;
  const generated = useId();
  const controlId = id ?? `smbc-ui-${generated}`;
  const labelId = label ? `${controlId}-label` : undefined;
  const descriptionId =
    [help ? `${controlId}-help` : '', error ? `${controlId}-error` : '']
      .filter(Boolean)
      .join(' ') || undefined;
  const container = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const host = container.current;
    if (!host || !descriptionId) return;
    const ownedIds = descriptionId.split(' ');
    // DevExtreme replaces aria-describedby when rendering validation messages.
    // Preserve its ids while retaining the Field's help and external error ids.
    const control = () => {
      const element = host.ownerDocument.getElementById(controlId);
      return element && host.contains(element) ? element : null;
    };
    const associate = () => {
      const element = control();
      if (!element) return;
      const current = element.getAttribute('aria-describedby') ?? '';
      const merged = [
        ...new Set([...current.split(' ').filter(Boolean), ...ownedIds]),
      ].join(' ');
      if (merged !== current) element.setAttribute('aria-describedby', merged);
    };
    const observer = new MutationObserver(associate);
    observer.observe(host, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ['aria-describedby'],
    });
    associate();
    return () => {
      observer.disconnect();
      const element = control();
      const remaining = (element?.getAttribute('aria-describedby') ?? '')
        .split(' ')
        .filter((id) => id && !ownedIds.includes(id))
        .join(' ');
      if (remaining) element?.setAttribute('aria-describedby', remaining);
      else element?.removeAttribute('aria-describedby');
    };
  }, [controlId, descriptionId]);
  return (
    <FieldContext.Provider
      value={{
        id: controlId,
        labelId,
        descriptionId,
        required,
        error,
        externalValidation: 'error' in props,
      }}
    >
      <div
        {...rest}
        ref={container}
        className={`smbc-ui-field${wide ? ' smbc-ui-field--wide' : ''} ${className}`.trim()}
      >
        {label && (
          <label className="smbc-ui-label" id={labelId} htmlFor={controlId}>
            {label}
            {required && <span aria-hidden="true"> *</span>}
          </label>
        )}
        {children}
        {help && (
          <span className="smbc-ui-caption" id={`${controlId}-help`}>
            {help}
          </span>
        )}
        {error && (
          <span
            className="smbc-ui-field__error"
            id={`${controlId}-error`}
            role="alert"
          >
            {error}
          </span>
        )}
      </div>
    </FieldContext.Provider>
  );
}
export type ControlAccessibility = {
  id?: string;
  ariaLabel?: string;
  required?: boolean;
  error?: string;
};
export function useControlAccessibility(
  props: ControlAccessibility,
  original?: Record<string, unknown>,
) {
  const field = useContext(FieldContext);
  const required = props.required ?? field?.required;
  const error = props.error ?? field?.error;
  const externalValidation = 'error' in props || field?.externalValidation;
  return {
    validationProps: externalValidation
      ? {
          isValid: !error,
          validationErrors: error ? [{ message: error }] : null,
        }
      : {},
    attrs: {
      ...original,
      ...((props.id ?? field?.id) ? { id: props.id ?? field?.id } : {}),
      ...(props.ariaLabel
        ? { 'aria-label': props.ariaLabel }
        : field?.labelId
          ? { 'aria-labelledby': field.labelId }
          : {}),
      ...(field?.descriptionId
        ? {
            'aria-describedby': [
              original?.['aria-describedby'],
              field.descriptionId,
            ]
              .filter(Boolean)
              .join(' '),
          }
        : {}),
      ...(required ? { 'aria-required': 'true' } : {}),
      ...(externalValidation
        ? { 'aria-invalid': error ? 'true' : 'false' }
        : {}),
    },
  };
}
