'use client';

import * as React from 'react';
import { cn } from '@/utils/cn';

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number;
  className?: string;
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ value = 0, className, ...props }, ref) => {
    // Ensure value is between 0 and 100
    const normalizedValue = React.useMemo(() => {
      if (typeof value !== 'number') return 0;
      return Math.min(Math.max(value, 0), 100);
    }, [value]);

    return (
      <div
        ref={ref}
        role='progressbar'
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={normalizedValue}
        className={cn(
          'relative h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800',
          className
        )}
        {...props}
      >
        <div
          className='h-full w-full bg-slate-900 dark:bg-slate-50 transition-transform duration-500 ease-in-out'
          style={{
            transform: `translateX(-${100 - normalizedValue}%)`,
          }}
        />
      </div>
    );
  }
);

Progress.displayName = 'Progress';

export { Progress };
