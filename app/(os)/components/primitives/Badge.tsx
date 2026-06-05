import { clsx } from 'clsx';

type BadgeVariant = 'default' | 'violet' | 'green' | 'yellow' | 'red' | 'muted';

const variantClasses: Record<BadgeVariant, string> = {
  default:  'bg-white/8 text-white/60',
  violet:   'bg-violet-500/20 text-violet-300',
  green:    'bg-emerald-500/20 text-emerald-400',
  yellow:   'bg-yellow-500/20 text-yellow-400',
  red:      'bg-red-500/20 text-red-400',
  muted:    'bg-white/5 text-white/30',
};

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  return (
    <span className={clsx(
      'inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium',
      variantClasses[variant],
      className,
    )}>
      {children}
    </span>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, BadgeVariant> = {
    inbox: 'muted',
    scored: 'yellow',
    approved: 'violet',
    in_production: 'yellow',
    published: 'green',
    archived: 'muted',
    current: 'violet',
    playing: 'green',
    considering: 'yellow',
    completed: 'muted',
    dropped: 'red',
  };
  return <Badge variant={map[status] ?? 'default'}>{status.replace('_', ' ')}</Badge>;
}
