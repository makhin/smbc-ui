import type { HTMLAttributes, ReactNode } from 'react';
type BoxProps = HTMLAttributes<HTMLDivElement>;
function box(name: string) {
  return function Box({ className = '', ...props }: BoxProps) {
    return <div {...props} className={`smbc-ui-${name} ${className}`.trim()} />;
  };
}
export const Card = Object.assign(box('card'), {
  Header: box('card__header'),
  Title: box('card__title'),
  Body: box('card__body'),
  Footer: box('card__footer'),
});
export const FilterPanel = box('filter-panel');
export const TableShell = box('table-shell');
export type StatusBadgeTone =
  | 'neutral'
  | 'info'
  | 'warning'
  | 'success'
  | 'danger'
  | 'brand';
export type StatusBadgeProps = HTMLAttributes<HTMLSpanElement> & {
  tone?: StatusBadgeTone;
};
export function StatusBadge({
  tone = 'neutral',
  className = '',
  ...props
}: StatusBadgeProps) {
  return (
    <span
      {...props}
      className={`smbc-ui-status-badge smbc-ui-status-badge--${tone} ${className}`.trim()}
    />
  );
}
export type CalloutProps = Omit<BoxProps, 'title'> & {
  tone?: 'info' | 'brand' | 'warning' | 'danger';
  title?: ReactNode;
};
export function Callout({
  tone = 'info',
  title,
  children,
  className = '',
  ...props
}: CalloutProps) {
  return (
    <div
      {...props}
      className={`smbc-ui-callout smbc-ui-callout--${tone} ${className}`.trim()}
    >
      {title && <strong>{title}</strong>}
      {children}
    </div>
  );
}
export type KpiCardProps = HTMLAttributes<HTMLElement> & {
  label: ReactNode;
  value: ReactNode;
  meta?: ReactNode;
};
export function KpiCard({
  label,
  value,
  meta,
  className = '',
  ...props
}: KpiCardProps) {
  return (
    <article {...props} className={`smbc-ui-kpi ${className}`.trim()}>
      <div className="smbc-ui-kpi__label">{label}</div>
      <div className="smbc-ui-kpi__value">{value}</div>
      {meta && <div className="smbc-ui-kpi__meta">{meta}</div>}
    </article>
  );
}
export type EmptyStateProps = Omit<BoxProps, 'title'> & {
  title?: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  icon?: string;
};
export function EmptyState({
  title,
  description,
  action,
  icon,
  children,
  className = '',
  ...props
}: EmptyStateProps) {
  return (
    <div {...props} className={`smbc-ui-empty-state ${className}`.trim()}>
      {icon && (
        <div className="smbc-ui-empty-state__icon" aria-hidden="true">
          <i className={`dx-icon dx-icon-${icon}`} />
        </div>
      )}
      {title && <h3>{title}</h3>}
      {description && <p>{description}</p>}
      {action}
      {children}
    </div>
  );
}
