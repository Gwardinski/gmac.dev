import { cn } from './utils';

interface NotificationProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  value: number | undefined | null;
}

export function Notification({ className, value, ...props }: NotificationProps) {
  if (value === undefined || value === null || value === 0) {
    return null;
  }
  return (
    <span
      className={cn(
        'flex h-6 max-h-6 max-w-fit min-w-fit items-center justify-center gap-1 rounded-full bg-red-700 px-2 text-sm font-medium text-white transition-colors',
        className
      )}
      {...props}>
      {getBadgeValue(value)}
    </span>
  );
}

function getBadgeValue(value: number) {
  if (value >= 100) {
    return '99+';
  }
  return value.toString();
}
