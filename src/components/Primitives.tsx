import type { HTMLAttributes, ReactNode } from 'react';
type BoxProps = HTMLAttributes<HTMLDivElement>;
// Private composition helper for semantic components, not a public layout API.
function box(classes: string) {
  return function Box({ className = '', ...props }: BoxProps) {
    return <div {...props} className={`${classes} ${className}`.trim()} />;
  };
}
const surface = 'ui:box-border ui:bg-surface ui:border-[length:var(--border-width-default)] ui:border-solid ui:border-border ui:rounded-card';
export const Card = Object.assign(box(`smbc-ui-card ${surface} ui:shadow-card-elevation`), {
  Header: box('ui:box-border ui:flex ui:items-center ui:justify-between ui:gap-4 ui:min-h-12 ui:px-4 ui:py-3 ui:border-b-[length:var(--border-width-default)] ui:border-border'),
  Title: box('ui:text-lg ui:font-semibold'),
  Body: box('ui:p-4'),
  Footer: box('ui:flex ui:flex-wrap ui:justify-end ui:gap-2 ui:px-4 ui:py-3 ui:border-t-[length:var(--border-width-default)] ui:border-border'),
});
export const FilterPanel = box(`${surface} ui:grid ui:grid-cols-1 ui:gap-x-4 ui:gap-y-3 ui:p-4 ui:md:grid-cols-2 ui:xl:grid-cols-4`);
export const TableShell = box(`smbc-ui-table-shell ${surface} ui:w-full ui:min-w-0 ui:overflow-hidden`);
export type StatusBadgeTone =
  | 'neutral'
  | 'info'
  | 'warning'
  | 'success'
  | 'danger'
  | 'brand';
const badgeTones = {
  neutral: 'ui:bg-surface-subtle ui:text-fg-muted',
  info: 'ui:bg-info-subtle ui:text-info',
  warning: 'ui:bg-warning-subtle ui:text-warning',
  success: 'ui:bg-success-subtle ui:text-success',
  danger: 'ui:bg-danger-subtle ui:text-danger',
  brand: 'ui:bg-surface-selected ui:text-primary',
} satisfies Record<StatusBadgeTone, string>;
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
      className={`ui:box-border ui:inline-flex ui:items-center ui:min-h-5.5 ui:px-2 ui:rounded-badge ui:text-xs ui:font-semibold ui:leading-none ${badgeTones[tone]} ${className}`.trim()}
    />
  );
}
export type CalloutProps = Omit<BoxProps, 'title'> & {
  tone?: 'info' | 'brand' | 'warning' | 'danger';
  title?: ReactNode;
};
const calloutTones = {
  info: 'ui:border-primary ui:bg-surface-subtle',
  brand: 'ui:border-accent ui:bg-surface-selected',
  warning: 'ui:border-warning ui:bg-warning-faint',
  danger: 'ui:border-danger ui:bg-danger-faint',
} as const;
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
      className={`ui:box-border ui:px-4 ui:py-3 ui:border-l-[length:var(--border-width-emphasis)] ${calloutTones[tone]} ${className}`.trim()}
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
    <article {...props} className={`${surface} ui:p-4 ${className}`.trim()}>
      <div className="ui:text-sm ui:text-fg-muted">{label}</div>
      <div className="ui:mt-1 ui:text-2xl ui:font-semibold">{value}</div>
      {meta && <div className="ui:mt-2 ui:text-xs ui:text-fg-muted">{meta}</div>}
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
    <div {...props} className={`ui:box-border ui:grid ui:place-items-center ui:min-h-60 ui:p-8 ui:text-center ui:text-fg-muted ui:bg-surface ui:border-[length:var(--border-width-default)] ui:border-dashed ui:border-border-strong ui:rounded-card ${className}`.trim()}>
      {icon && (
        <div className="smbc-ui-empty-state-icon ui:grid ui:place-items-center ui:size-11 ui:mb-2 ui:rounded-circle ui:bg-surface-selected ui:text-primary" aria-hidden="true">
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
