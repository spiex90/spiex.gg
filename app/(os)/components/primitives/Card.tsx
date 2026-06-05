import { clsx } from 'clsx';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
  accent?: boolean;
}

export function Card({ children, className, hover, accent, ...props }: CardProps) {
  return (
    <div
      className={clsx(
        'bg-[#0f0f14] border border-white/5 rounded-xl',
        hover && 'hover:border-white/10 transition-colors cursor-pointer',
        accent && 'border-l-2 border-l-violet-500',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={clsx('p-5 border-b border-white/5', className)} {...props}>
      {children}
    </div>
  );
}

export function CardBody({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={clsx('p-5', className)} {...props}>
      {children}
    </div>
  );
}
