import React from 'react';
import { cn } from '../../../utils/cn';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'circular' | 'rectangular';
}

export function Skeleton({
  className,
  variant = 'rectangular',
  ...props
}: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse bg-gray-200',
        {
          'h-4 w-full': variant === 'text',
          'rounded-full': variant === 'circular',
          'rounded-md': variant === 'rectangular',
        },
        className
      )}
      {...props}
    />
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow p-4 space-y-4">
      <Skeleton className="h-48 w-full" />
      <Skeleton variant="text" className="w-2/3" />
      <Skeleton variant="text" className="w-1/2" />
      <div className="flex justify-between items-center">
        <Skeleton variant="text" className="w-1/4" />
        <Skeleton className="h-10 w-24" />
      </div>
    </div>
  );
} 